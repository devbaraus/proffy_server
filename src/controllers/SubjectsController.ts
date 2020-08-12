import { Request, Response } from 'express'
import db from '../database/connection'

export default class SubjectsController {
  async index(request: Request, response: Response) {
    try {
      const storedSubjects = await db('subjects').select('*')
      return response.json(storedSubjects)
    } catch (e) {
      console.log(e)
      response.sendStatus(400)
    }
  }
}
