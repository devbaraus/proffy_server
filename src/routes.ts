import express from 'express'
import ClassesController from './controllers/ClassesController'
import ConnectionsController from './controllers/ConnectionsController'
import UsersController from './controllers/UsersController'
import AvatarsController from './controllers/AvatarsController'
import ClassScheduleController from './controllers/ClassScheduleController'
import authenticationMiddleware from './middlewares/auth'
import { parser } from './middlewares/cloudinary'
import SubjectsController from './controllers/SubjectsController'

const routes = express.Router()
const classesController = new ClassesController()
const connectionsController = new ConnectionsController()
const usersController = new UsersController()
const avatarsController = new AvatarsController()
const classScheduleController = new ClassScheduleController()
const subjectsController = new SubjectsController()

// http://localhost:3333/classes

routes.post('/authenticate', usersController.authenticate)

routes.post('/register', usersController.create)

routes.post('/validate-account', usersController.validate)

routes.post('/forgot-password', usersController.forgotPassword)

routes.post('/reset-password', usersController.resetPassword)

routes.post(
  '/avatar',
  authenticationMiddleware,
  parser.single('image'),
  avatarsController.upload,
)

routes.get('/users/:id', authenticationMiddleware, usersController.index)

routes.get('/profile', authenticationMiddleware, usersController.index)

routes.put('/profile', authenticationMiddleware, usersController.update)

routes.get('/subjects', authenticationMiddleware, subjectsController.index)

routes.get('/classes', authenticationMiddleware, classesController.index)

routes.post('/classes', authenticationMiddleware, classesController.create)

routes.put('/classes', authenticationMiddleware, classesController.update)
routes.delete('/classes', authenticationMiddleware, classesController.delete)

// routes.get('/classes', authenticationMiddleware, classesController.index)
//
routes.post(
  '/class-schedule',
  authenticationMiddleware,
  classScheduleController.create,
)
//
routes.delete(
  '/class-schedule',
  authenticationMiddleware,
  classScheduleController.delete,
)

routes.get('/connections', connectionsController.index)

routes.post(
  '/connections',
  authenticationMiddleware,
  connectionsController.create,
)

export default routes
