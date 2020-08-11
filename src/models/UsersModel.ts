import Knex, { Transaction } from 'knex'
import db from '../database/connection'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface UserInterface {
    id?: number
    name: string
    surname: string
    avatar: ArrayBuffer | string
    bio: string
    email: string
    whatsapp: string
    password: string
}

export async function indexUser(
    id: string | number,
    transaction?: Promise<Knex.Transaction<any, any>>,
) {
    if (transaction) {
        return (await transaction)('users').select('*').where('id', id)
    } else {
        return db.table('users').select('*').where('id', id)
    }
}

export async function indexUserByEmail(
    email: string,
    transaction?: Promise<Knex.Transaction<any, any>>,
) {
    // @ts-ignore
    let trdb: Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord, never>[]>

    if (transaction) {
        trdb = (await transaction)('users')
    } else {
        trdb = db.table('users')
    }

    return trdb
        .select('id', 'name', 'surname', 'email', 'password')
        .where('email', email)
}

export async function indexAllUser(
    transaction?: Promise<Knex.Transaction<any, any>>,
) {
    // @ts-ignore
    let trdb: Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord, never>[]>

    if (transaction) {
        trdb = (await transaction)('users')
    } else {
        trdb = db.table('users')
    }

    return trdb.select('*')
}

export async function createUser(
    user: UserInterface,
    transaction?: Knex.Transaction<any, any>,
) {
    if (transaction) {
        return (await transaction)('users').insert(user)
    } else {
        return db.table('users').insert(user)
    }
}

export async function deleteUser(
    id: number,
    transaction?: Knex.Transaction<any, any>,
) {
    if (transaction) {
        return (await transaction)('users').where('id', id).delete()
    } else {
        return db.table('users').where('id', id).delete()
    }
}

export async function updateUser(
    user:
        | UserInterface
        | {
              id: string | number
          },
    transaction?: Knex.Transaction<any, any>,
) {
    if (transaction) {
        return (await transaction)('users').where('id', user.id).update(user)
    } else {
        return db.table('users').where('id', user.id).update(user)
    }
}

export async function encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
}

export async function comparePassword(
    password: string,
    hash: string,
): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}

export function userToken(id: number | string) {
    return jwt.sign({ id }, String(process.env.SECRET), {
        expiresIn: 86400,
    })
}