import knex from 'knex'

export async function up(knex: knex) {
  return knex.schema.createTable('classes', (table) => {
    table.increments('id').primary()
    table.string('summary', 1000).notNullable()
    table.decimal('cost').notNullable()

    table.timestamp('created_at').defaultTo(knex.raw('now()')).notNullable()

    table
      .integer('subject_id')
      .notNullable()
      .references('id')
      .inTable('subjects')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')

    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

export async function down(knex: knex) {
  return knex.schema.dropTable('classes')
}
