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
            const storedUser = (
                await indexUserByEmail(email)
            )[0] as UserInterface
            if (!storedUser) {
                return response
                    .status(400)
                    .json({ error: 'Não existe esse usuário.' })
            }
            if (!(await comparePassword(password, storedUser.password))) {
                return response.status(400).json({ error: 'Senha inválida.' })
            }

            const { name, surname, id } = storedUser
            response.json({
                token: generateToken({ id }),
                user: {
                    name,
                    surname,
                    email,
                },
            })
        } catch (e) {
            console.log(e)
            return response
                .status(400)
                .json({ error: 'Não foi possível executar a autenticação.' })
        }
    }

    // @ts-ignore
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
            return response.status(400).json({
                error: 'Não foi possível realizar esta operação.',
            })
        }
    }
    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            bio,
            whatsapp,
            email,
            password,
            surname,
        } = request.body
        try {
            if (!emailValidator(email))
                throw new ProffyError('E-mail inválido.')

            if (!passwordValidator(password))
                throw new ProffyError(
                    'Senha não atende aos requisitos básicos.',
                )
            if (whatsapp && !phoneValidator(whatsapp))
                throw new ProffyError('Número de WhatsApp inválido.')

            if ((await indexUserByEmail(email))[0] as UserInterface)
                return response
                    .status(400)
                    .json({ error: 'Este email já está sendo usado.' })

            const hashedPassword = await encryptPassword(password)
            const storedUser = (
                await createUser({
                    name,
                    surname,
                    avatar:
                        avatar ||
                        'https://api.adorable.io/avatars/285/abott@adorable.png',
                    bio,
                    whatsapp,
                    email,
                    password: hashedPassword,
                })
            )[0]

            indexUser(storedUser).then((user) => {
                const { id, email, name, surname } = user[0]
                return response.json({
                    token: generateToken({ id }),
                    user: {
                        id,
                        email,
                        name,
                        surname,
                    },
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
}
