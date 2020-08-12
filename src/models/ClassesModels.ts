import Knex from 'knex'
import db from '../database/connection'

// export interface ClassInterface {
//   id?: string
//   subject?: string
//   cost?: string
//   summary? string
//   user_id?: string
// }

export async function indexClass(
  id: string | number,
  transaction?: Promise<Knex.Transaction<any, any>>,
) {
  // @ts-ignore
  let trdb: Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord, never>[]>

  if (transaction) {
    trdb = (await transaction)('users')
  } else {
    trdb = db.table('users')
  }

  return trdb.select('*').where('id', id)
}

export async function indexClassSchedules() {}
