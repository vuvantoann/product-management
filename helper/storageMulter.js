const multer = require('multer')
const path = require('path')

module.exports = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const ext = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    },
  })

  return storage
}
