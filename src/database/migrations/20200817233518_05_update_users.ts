import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', function (table) {
    table.boolean('validated')
    table.string('validateToken', 255).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', function (table) {
    table.dropColumn('validated')
    table.dropColumn('validateToken')
  })
}
