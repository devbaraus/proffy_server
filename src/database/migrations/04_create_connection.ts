import knex from 'knex'

export async function up(knex: knex) {
  return knex.schema.createTable('connections', (table) => {
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')

    table
      .integer('class_id')
      .notNullable()
      .references('id')
      .inTable('classes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

export async function down(knex: knex) {
  return knex.schema.dropTable('connections')
}
