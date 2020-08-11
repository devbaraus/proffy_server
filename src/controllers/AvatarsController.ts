import { Response, Request } from 'express'
import { indexUser, updateUser } from '../models/UsersModel'
import { destroy } from '../middlewares/cloudinary'

export default class AvatarsController {
  async upload(request: Request, response: Response) {
    // @ts-ignore
    const userId = request.user_id
    const { path } = request.file
    try {
      const { avatar } = (await indexUser(userId))[0]
      if (avatar !== 'https://api.adorable.io/avatars/285/abott@adorable.png') {
        const destroyPath = avatar.split('/').splice(7, 2)
        await destroy(
          `${destroyPath[0]}/${destroyPath[1].replace(/\.[a-zA-Z0-9]+$/g, '')}`,
        )
      }
      await updateUser({ id: userId, avatar: path })
      return response.json({ avatar: path })
    } catch (e) {}
  }
}
