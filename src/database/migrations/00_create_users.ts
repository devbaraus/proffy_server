import knex from 'knex'

export async function up(knex: knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('surname').notNullable()
    table.string('whatsapp').nullable()
    table.text('bio').nullable()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('avatar').nullable()
    table.timestamp('created_at').defaultTo(knex.raw('now()')).notNullable()
  })
}

export async function down(knex: knex) {
  return knex.schema.dropTable('users')
}
