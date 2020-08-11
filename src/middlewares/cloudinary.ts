import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
  url: process.env.CLOUDINARY_URL,
  name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'proffy',
    // @ts-ignore
    allowedFormats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 512, height: 512, crop: 'fill' }],
  },
})

const parser = multer({ storage: storage })

function destroy(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

export { parser, destroy }
