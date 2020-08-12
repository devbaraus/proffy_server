import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
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
import {
  emailValidator,
  passwordValidator,
  phoneValidator,
} from '../utils/validators'
import ProffyError from '../prototypes/ProffyError'

function generateToken(params: any) {
  return jwt.sign(params, String(process.env.SECRET), {
    expiresIn: 60 * 60 * 24,
  })
}

export default class UsersController {
  async authenticate(request: Request, response: Response) {
    const { email, password } = request.body
    try {
      const storedUser = (await indexUserByEmail(email))[0] as UserInterface
      if (!storedUser) {
        return response.status(400).json({ error: 'Não existe esse usuário.' })
      }
      if (!(await comparePassword(password, storedUser.password as string))) {
        return response.status(400).json({ error: 'Senha inválida.' })
      }

      const { name, surname, id, avatar } = storedUser
      response.json({
        token: generateToken({ id }),
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
    // @ts-ignore
    const userId = request.user_id
    try {
      const { id, surname, avatar, bio, name, email, whatsapp } = (
        await indexUser(userId)
      )[0] as UserInterface
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
      })
    } catch (e) {
      return response.status(401).json({
        error: 'Usuário não existente.',
      })
    }
  }

  async create(request: Request, response: Response) {
    try {
      const {
        name,
        avatar,
        bio,
        whatsapp,
        email,
        password,
        surname,
      } = request.body

      if (!emailValidator(email)) throw new ProffyError('E-mail inválido.')

      if (!passwordValidator(password))
        throw new ProffyError('Senha não atende aos requisitos básicos.')
      if (whatsapp && !phoneValidator(whatsapp))
        throw new ProffyError('Número de WhatsApp inválido.')

      if ((await indexUserByEmail(email))[0] as UserInterface)
        return response
          .status(400)
          .json({ error: 'Este email já está sendo usado.' })

      const hashedPassword = await encryptPassword(password)
      const storedUser = await createUser({
        name,
        surname,
        avatar:
          avatar || `https://api.adorable.io/avatars/285/${name}@proffy.png`,
        bio,
        whatsapp,
        email,
        password: hashedPassword,
      })

      const { id } = storedUser[0]

      return response.json({
        token: generateToken({ id }),
        user: {
          id,
          email,
          name,
          surname,
          avatar,
        },
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
}
