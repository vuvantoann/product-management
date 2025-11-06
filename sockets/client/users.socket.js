const User = require('../../modals/user.modal')

module.exports = async (res) => {
  const myUserId = res.locals.user.id
  _io.once('connection', (socket) => {
    // Chức năng gửi yêu cầu
    socket.on('CLIENT_ADD_FRIEND', async (userId) => {
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
    //kết thúc Chức năng gửi yêu cầu

    // chức năng hủy yêu cầu kết bạn
    socket.on('CLIENT_CANCEL_FRIEND', async (userId) => {
      // xóa id của người gửi khỏi data của người nhận
      const existIdSenderInReceiver = await User.findOne({
        _id: userId,
        acceptFriend: myUserId,
      })

      if (existIdSenderInReceiver) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: {
              acceptFriend: myUserId,
            },
          }
        )
      }
      // xóa id của người khỏi vào data của người gửi
      const existIdReceiverInSender = await User.findOne({
        _id: myUserId,
        requestFriend: userId,
      })

      if (existIdReceiverInSender) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: {
              requestFriend: userId,
            },
          }
        )
      }
    })
    //kết thúc chức năng hủy yêu cầu kết bạn
  })
}
