import db from '../database/connection'
import {
  convertHourToMinutes,
  convertMinutesToHours,
} from '../utils/convertHourToMinutes'
import { Request, Response } from 'express'
import { createUser } from '../models/UsersModel'
import { indexClass } from '../models/ClassesModels'

interface ScheduleItem {
  id?: number
  week_day: number
  from: string
  to: string
}

export async function getSchedulesfromClasses(classes: any, teacher = true) {
  for (let classItem in classes) {
    const {
      user_id,
      name,
      avatar,
      whatsapp,
      id,
      subject_id,
      cost,
      summary,
    } = classes[classItem]

    const schedules = await db
      .select('class_schedule.*')
      .from('class_schedule')
      .join('classes', 'classes.id', 'class_schedule.class_id')
      .where('classes.id', id)
      .orderBy('class_schedule.week_day')

    classes[classItem] = {
      id,
      cost,
      subject_id,
      summary,
      teacher: teacher
        ? {
            id: user_id,
            name: name,
            whatsapp: whatsapp,
            avatar: avatar,
          }
        : null,
      schedules: schedules.map(({ id, week_day, from, to }) => {
        return {
          id,
          week_day,
          from: convertMinutesToHours(from),
          to: convertMinutesToHours(to),
        }
      }),
    }
  }
  return classes
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query
    // @ts-ignore
    const user_id = request.user_id

    const subject_id = filters.subject_id as string
    const week_day = filters.week_day as string
    const time = filters.time as string
    const id = filters.id as string

    if (!filters.week_day && !filters.subject_id && !filters.time) {
      let classes
      if (id) {
        classes = await db('classes')
          .select([
            'classes.id',
            'subject_id',
            'cost',
            'summary',
            'user_id',
            'whatsapp',
            'avatar',
          ])
          .select(db.raw(`users.name || ' ' || surname as name`))
          .join('users', 'classes.user_id', 'users.id')
          .join('subjects', 'classes.subject_id', 'subjects.id')
          .where('classes.id', id)
          .where('classes.user_id', user_id)
          .orderBy('classes.created_at', 'desc')
        if (classes.length < 1) {
          return response.status(404).json()
        }
        classes = (await getSchedulesfromClasses(classes))[0]

        return response.json(classes)
      } else {
        classes = await db('classes')
          .select([
            'classes.id',
            'subject_id',
            'cost',
            'summary',
            'user_id',
            'whatsapp',
            'avatar',
          ])
          .select(db.raw(`users.name || ' ' || surname as name`))
          .leftJoin('subjects', 'classes.subject_id', 'subjects.id')
          .leftJoin('users', 'classes.user_id', '=', 'users.id')
          .orderBy('classes.created_at', 'desc')

        classes = await getSchedulesfromClasses(classes)

        return response.json(classes)
      }
    }
    const timeInMinutes = convertHourToMinutes(time as string)

    let classes = await db('classes')
      .select([
        'classes.id',
        'subject_id',
        'cost',
        'summary',
        'user_id',
        'whatsapp',
        'avatar',
      ])
      .select(db.raw(`users.name || ' ' || surname as name`))
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('class_schedule.class_id = classes.id')
          .whereRaw('class_schedule.week_day = ??', [Number(week_day)])
          .whereRaw('class_schedule.to > ??', [timeInMinutes])
          .whereRaw('class_schedule.from <= ??', [timeInMinutes])
      })
      .where('classes.subject_id', '=', Number(subject_id))
      .join('subjects', 'classes.subject_id', 'subjects.id')
      .join('users', 'classes.user_id', 'users.id')
      .orderBy('classes.created_at', 'desc')

    classes = await getSchedulesfromClasses(classes)

    return response.json(classes)
  }

  async create(request: Request, response: Response) {
    const { subject_id, cost, schedule, summary } = request.body
    // @ts-ignore
    const user_id = request.user_id

    const trx = await db.transaction()

    try {
      if(Number(cost) < 0) response.sendStatus(422)

      const insertedClassID = await trx('classes')
        .insert({
          subject_id,
          cost,
          summary,
          user_id,
        })
        .returning('*')

      const class_id = insertedClassID[0].id

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        }
      })

      await trx('class_schedule').insert(classSchedule)

      await trx.commit()

      return response.status(201).json({
        class: {
          id: class_id,
          subject_id,
          cost,
          summary,
        },
      })
    } catch (e) {
      await trx.rollback()
      console.log(e)
      return response.status(400).json({
        error: 'Unexpected error while creating new class',
      })
    }
  }

  async update(request: Request, response: Response) {
    const { subject_id, cost, schedule, summary, id } = request.body
    // @ts-ignore
    const user_id = request.user_id

    const trx = await db.transaction()

    try {
      if(Number(cost) < 0) response.sendStatus(422)

      const insertedClassID = await trx('classes')
        .update({
          subject_id,
          cost,
          summary,
          user_id,
        })
        .where('classes.id', id)

      const class_id = insertedClassID

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          id: scheduleItem.id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        }
      })

      await db.transaction((trx) => {
        const queries: any[] = []
        classSchedule.map(async (schedule: ScheduleItem) => {
          const query = db('class_schedule')
            .update(schedule)
            .where('id', schedule.id)
            .transacting(trx)
          queries.push(query)
        })

        Promise.all(queries) // Once every query is written
          .then(trx.commit) // We try to execute all of them
          .catch(trx.rollback) // And rollback in case any of them goes wrong
      })

      trx.commit()

      return response.status(201).json({
        class: {
          id: class_id,
          subject_id,
          cost,
          summary,
          schedules: classSchedule,
        },
      })
    } catch (e) {
      await trx.rollback()
      return response.status(400).json({
        error: e.message,
      })
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.query

    // @ts-ignore
    const user_id = request.user_id

    const trx = await db.transaction()

    console.log(id, user_id)

    try {
      await trx('classes')
        .del()
        .where('id', Number(id))
        .where('user_id', Number(user_id))
        .returning('*')

      await trx('class_schedule')
        .del()
        .where('class_id', Number(id))
        .returning('*')

      trx.commit()
      return response.json(true)
    } catch (e) {
      console.log(e.message)
      trx.rollback()
      return response.status(400).json({
        error: e.message,
      })
    }
  }
}
