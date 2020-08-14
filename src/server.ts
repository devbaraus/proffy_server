import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes'
import mailer from './services/mailer'

const app = express()

app.use(express.json())

app.use(cors())
app.use(morgan('dev'))

app.use('/v1/', routes)

app.listen(process.env.PORT, async () => {
  console.log('Server running at', process.env.PORT)
})
