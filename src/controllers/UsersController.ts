import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import {
  indexUser,
  createUser,
  indexAllUser,
  indexUserByEmail,
  encryptPassword,
  comparePassword,
  UserInterface,
  updateUser,
} from '../models/UsersModel'
import { emailValidator, passwordValidator } from '../utils/validators'
import ProffyError from '../prototypes/ProffyError'
import db from '../database/connection'
import mailer, {
  templateResetPassword,
  templateValidateAccount,
} from '../services/mailer'
import { getSchedulesfromClasses } from './ClassesController'
const { MAILER_USER } = process.env

function generateToken(params: any) {
  return jwt.sign(params, String(process.env.SECRET), {
    expiresIn: 60 * 60,
  })
}

function decodeToken(params: string): { email: string; password: string } {
  return jwt.decode(params) as { email: string; password: string }
}

export default class UsersController {
  async validate(request: Request, response: Response) {
    const { token } = request.body
    try {
      const storedUser = (
        await db('users').select('*').where('validateToken', token)
      )[0]

      if (!storedUser) return response.sendStatus(404)

      if (!storedUser.validated)
        await db('users')
          .update({ validated: true, validateToken: null })
          .where('validateToken', token)

      response.json()
    } catch (error) {
      console.log(error)
      response.sendStatus(400)
    }
  }
  async authenticate(request: Request, response: Response) {
    let { email, password, refresh_token } = request.body
    try {
      let storedUser
      let hashPassword

      if (!!refresh_token) {
        // @ts-ignore
        const tokenUser = decodeToken(refresh_token)
        email = tokenUser.email
        hashPassword = tokenUser.password

        storedUser = (
          await indexUserByEmail(tokenUser.email)
        )[0] as UserInterface

        if (hashPassword !== storedUser.password) {
          return response.status(403).json({ error: 'Senha inválida.' })
        }
      } else {
        storedUser = (await indexUserByEmail(email))[0] as UserInterface

        if (!(await comparePassword(password, storedUser.password as string))) {
          return response.status(403).json({ error: 'Senha inválida.' })
        }

        if (!storedUser.validated) {
          return response.status(401).json({ error: 'Valide sua conta.' })
        }
      }

      if (!storedUser) {
        return response.status(404).json({ error: 'Não existe esse usuário.' })
      }

      const { name, surname, id, avatar } = storedUser
      response.json({
        token: generateToken({ id }),
        refresh_token: generateToken({ email, password: storedUser.password }),
        user: {
          avatar,
          name,
          surname,
          email,
          id,
        },
      })
    } catch (e) {
      console.log(e)
      return response
        .status(400)
        .json({ error: 'Não foi possível executar a autenticação.' })
    }
  }

  async index(request: Request, response: Response) {
    const { classes } = request.query
    // @ts-ignore
    const userId = request.user_id
    try {
      const { id, surname, avatar, bio, name, email, whatsapp } = (
        await indexUser(userId)
      )[0] as UserInterface

      let storedClasses

      if (!!classes) {
        storedClasses = await db('classes')
          .select(['classes.id', 'subject_id', 'cost', 'summary'])
          .join('users', 'classes.user_id', 'users.id')
          .join('subjects', 'classes.subject_id', 'subjects.id')
          .where('user_id', userId)
          .orderBy('classes.created_at', 'desc')
        storedClasses = await getSchedulesfromClasses(storedClasses, false)
      }

      return response.json({
        user: {
          id,
          email,
          name,
          surname,
          bio,
          whatsapp,
          avatar,
        },
        classes: storedClasses,
      })
    } catch (e) {
      console.log(e)
      return response.status(401).json({
        error: 'Usuário não existente.',
      })
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { name, email, password, surname } = request.body

      if (!emailValidator(email)) throw new ProffyError('E-mail inválido.')

      if (!passwordValidator(password))
        throw new ProffyError('Senha não atende aos requisitos básicos.')

      if ((await indexUserByEmail(email))[0] as UserInterface)
        return response
          .status(400)
          .json({ error: 'Este email já está sendo usado.' })

      const avatar = `https://api.adorable.io/avatars/285/${name
        .toString()
        .toLowerCase()}@proffy.png`
      const token = crypto.randomBytes(20).toString('hex')
      const hashedPassword = await encryptPassword(password)
      const storedUser = await createUser({
        name,
        surname,
        avatar,
        email,
        password: hashedPassword,
        validated: false,
        validateToken: token,
      })

      const { id } = storedUser[0]

      mailer
        .sendMail({
          to: email,
          from: `"PROFFY" <${MAILER_USER}>`,
          subject: 'Valide sua conta Proffy',
          // @ts-ignore
          html: templateValidateAccount(token),
          // template: 'reset-password', // html body
          // context: { token }, // html body
        })
        .then(() =>
          // response.json({
          //   token: generateToken({ id }),
          //   refresh_token: generateToken({ email, password: hashedPassword }),
          //   user: {
          //     id,
          //     email,
          //     name,
          //     surname,
          //     avatar,
          //   },
          // }),
          response.json(),
        )
        .catch((e: any) => {
          console.log(e)
          response.status(400).json({
            error: 'Não foi possível criar sua conta, tente novamente!',
          })
        })
    } catch (e) {
      console.log(e)
      return response.status(400).json({
        error:
          e instanceof ProffyError
            ? e.message
            : 'Não foi possível realizar esta operação.',
      })
    }
  }

  async update(request: Request, response: Response) {
    const { name, surname, email, bio, whatsapp } = request.body

    // @ts-ignore
    const user_id = request.user_id

    try {
      const storedUser = await updateUser({
        id: user_id,
        name,
        surname,
        email,
        bio,
        whatsapp,
      })

      return response.status(201).json({ user: storedUser })
    } catch (e) {
      console.log(e)
      return response.status(400).json({
        error:
          e instanceof ProffyError
            ? e.message
            : 'Não foi possível realizar esta operação.',
      })
    }
  }

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body
    try {
      const user = (await indexUserByEmail(email))[0]

      if (!user)
        response.status(400).json({
          error: 'Usuário não encontrado',
        })

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await db('users')
        .update({
          passwordToken: token,
          passwordTokenExpires: now,
        })
        .where('email', email)

      mailer
        .sendMail({
          to: email,
          from: `'"PROFFY" <${MAILER_USER}>'`,
          subject: 'Redefinição de senha',
          // @ts-ignore
          html: templateResetPassword(token),
          // template: 'reset-password', // html body
          // context: { token }, // html body
        })
        .then(() => response.json())
        .catch((e: any) => {
          console.log(e)
          response.status(400).json({
            error: 'Erro não pedir redefinição de senha, tente novamente!',
          })
        })
    } catch (e) {
      console.log(e)
      response.status(400).json({
        error: 'Erro não pedir redefinição de senha, tente novamente!',
      })
    }
  }

  async resetPassword(request: Request, response: Response) {
    const { email, token, password } = request.body
    try {
      const user = (await indexUserByEmail(email))[0]

      if (!user)
        response.status(400).json({
          error: 'Usuário não encontrado',
        })

      if (new Date() > user.passwordTokenExpires && user.passwordToken != token)
        response.status(400).json({
          error: 'Token inválido',
        })

      if (!passwordValidator(password))
        response.status(400).json({
          error: 'Senha não atende aos quesitos básicos.',
        })

      await db('users')
        .update({
          password: await encryptPassword(password),
          passwordToken: null,
          passwordTokenExpires: null,
        })
        .where('email', email)

      response.json()
    } catch (e) {
      console.log(e)
      response.status(400).json({
        error: 'Erro não pedir redefinição de senha, tente novamente!',
      })
    }
  }
}
