const Chat = require('../../modals/chat.modal')
const uploadToCloudinary = require('../../helper/uploadToCloudinary')

module.exports = async (res) => {
  const userId = res.locals.user._id
  const fullName = res.locals.user.fullName

  _io.once('connection', (socket) => {
    socket.on('CLIENT_SEND_MESSAGE', async (data) => {
      let images = []

      for (let imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer)
        images.push(link)
      }

      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      })
      await chat.save()

      const time = chat.createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })

      _io.emit('SERVER_RETURN_MESSAGE', {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images,
        time: time,
      })
    })

    socket.on('CLIENT_SEND_TYPING', (type) => {
      socket.broadcast.emit('SERVER_RETURN_TYPING', {
        userId: userId,
        fullName: fullName,
        type: type,
      })
    })
  })
}
