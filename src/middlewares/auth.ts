import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export default function autenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization
  if (!authHeader) response.status(401).json({ error: 'No token provided.' })

  const parts = String(authHeader).split(' ')
  if (parts.length !== 2) response.status(401).json({ error: 'Token error.' })

  const [scheme, token] = parts
  if (!/^Bearer$/i.test(scheme))
    response.status(401).json({ error: 'Token malformatted.' })

  jwt.verify(token, String(process.env.SECRET), (err, decoded) => {
    if (err) response.status(401).json({ error: 'Invalid token.' })

    // @ts-ignore
    request.user_id = Number(decoded.id)
    return next()
  })
}
