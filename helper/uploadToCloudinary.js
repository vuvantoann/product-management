const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

// Configuration cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})
// end
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    })

    streamifier.createReadStream(buffer).pipe(stream)
  })
}

module.exports = async (buffer) => {
  let result = await streamUpload(buffer)
  return result.secure_url
}
