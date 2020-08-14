import knex from 'knex'

export async function up(knex: knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name', 24).notNullable()
    table.string('surname', 56).notNullable()
    table.string('whatsapp', 15).nullable()
    table.string('bio', 1000).nullable()
    table.string('email', 255).notNullable().unique()
    table.string('password', 255).notNullable()
    table.string('avatar', 255).notNullable()
    table.string('passwordToken', 255).nullable()
    table.timestamp('passwordTokenExpires').nullable()
    table.timestamp('created_at').defaultTo(knex.raw('now()')).notNullable()
  })
}

export async function down(knex: knex) {
  return knex.schema.dropTable('users')
}
