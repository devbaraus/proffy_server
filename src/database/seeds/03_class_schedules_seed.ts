import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('class_schedule').del()

  const subjects = [
    'Artes',
    'Biologia',
    'Ciências',
    'Educação Física',
    'Física',
    'Geografia',
    'História',
    'Matemática',
    'Português',
    'Química',
  ]

  function getRandomTime() {
    return Math.floor(Math.random() * 1440) % 1440
  }
  // Inserts seed entries
  await knex('class_schedule').insert([
    ...[1, 2, 3, 4, 5].map((item) => {
      const [from, to] = [getRandomTime(), getRandomTime()]
      return {
        week_day: item,
        from: from > to ? to : from,
        to: to > from ? to : from,
        class_id: 1,
      }
    }),
    ...[1, 3, 4, 5].map((item) => {
      const [from, to] = [getRandomTime(), getRandomTime()]
      return {
        week_day: item,
        from: from > to ? to : from,
        to: to > from ? to : from,
        class_id: 2,
      }
    }),
    ...[1, 2, 3, 4, 5, 6].map((item) => {
      const [from, to] = [getRandomTime(), getRandomTime()]
      return {
        week_day: item,
        from: from > to ? to : from,
        to: to > from ? to : from,
        class_id: 3,
      }
    }),
    ...[1, 2, 3, 4, 5].map((item) => {
      const [from, to] = [getRandomTime(), getRandomTime()]
      return {
        week_day: item,
        from: from > to ? to : from,
        to: to > from ? to : from,
        class_id: 4,
      }
    }),
    ...[1, 3, 4, 5, 0].map((item) => {
      const [from, to] = [getRandomTime(), getRandomTime()]
      return {
        week_day: item,
        from: from > to ? to : from,
        to: to > from ? to : from,
        class_id: 5,
      }
    }),
  ])
}
