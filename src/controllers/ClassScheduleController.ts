import { Request, Response } from 'express'
import db from '../database/connection'

export default class ClassScheduleController {
  async create(request: Request, response: Response) {
    try {
      const { class_id } = request.body
      // @ts-ignore

      const scheduleItem = await db('class_schedule')
        .insert({
          class_id,
          week_day: 0,
          from: 0,
          to: 0,
        })
        .returning(['class_id', 'id', 'week_day', 'from', 'to'])

      return response.json(scheduleItem[0])
    } catch (e) {
      response.sendStatus(400)
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.query
      // @ts-ignore
      await db('class_schedule').where('id', id).delete()
      return response.json()
    } catch (e) {
      console.log(e)
      response.sendStatus(400)
    }
  }
}
