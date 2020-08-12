import knex from 'knex'
import path from 'path'

const db = knex({
  client: 'postgres',
  connection: process.env.DATABASE_URL,
  useNullAsDefault: true,
  pool: {
    min: 0,
    max: 10,
  },
})

db.raw('select 1+1 as result')
  .then(() => {
    console.warn('Database connected successfully!')
  })
  .catch(() => {
    console.log(
      '[Fatal] Failed to establish connection to database! Exiting...',
    )
    process.exit(1)
  })

export default db
