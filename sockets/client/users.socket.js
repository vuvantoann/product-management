const User = require('../../modals/user.modal')

module.exports = async (res) => {
  const myUserId = res.locals.user.id
  _io.once('connection', (socket) => {
    socket.on('CLIENT_ADD_FRIEND', async (userId) => {
      console.log(userId)
      console.log(myUserId)

      // thêm id của người gửi vào data của người nhận
      const existIdSenderInReceiver = await User.findOne({
        _id: userId,
        acceptFriend: myUserId,
      })

      if (!existIdSenderInReceiver) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              acceptFriend: myUserId,
            },
          }
        )
      }
      // thêm id của người nhận vào data của người gửi
      const existIdReceiverInSender = await User.findOne({
        _id: myUserId,
        requestFriend: userId,
      })

      if (!existIdReceiverInSender) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              requestFriend: userId,
            },
          }
        )
      }
    })
  })
}
