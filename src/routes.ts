import express from 'express'
import ClassesController from './controllers/ClassesController'
import ConnectionsController from './controllers/ConnectionsController'
import UsersController from './controllers/UsersController'
import AvatarsController from './controllers/AvatarsController'
import autenticationMiddleware from './middlewares/auth'
import { parser } from './middlewares/cloudinary'

const routes = express.Router()
const classesController = new ClassesController()
const connectionsController = new ConnectionsController()
const usersController = new UsersController()
const avatarsController = new AvatarsController()

// http://localhost:3333/classes

routes.post('/authenticate', usersController.authenticate)

routes.post('/register', usersController.create)

routes.post(
    '/avatar',
    autenticationMiddleware,
    parser.single('image'),
    avatarsController.upload,
)

routes.get('/users/:id', autenticationMiddleware, usersController.index)

routes.get('/profile', autenticationMiddleware, usersController.index)

routes.get('/classes', autenticationMiddleware, classesController.index)

routes.post('/classes', autenticationMiddleware, classesController.create)

routes.get('/connections', connectionsController.index)

routes.post(
    '/connections',
    autenticationMiddleware,
    connectionsController.create,
)

export default routes
