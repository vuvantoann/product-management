const User = require('../../modals/user.modal')
const usersSocket = require('../../sockets/client/users.socket')

module.exports.notFriend = async (req, res) => {
  const useId = res.locals.user.id
  const myUser = await User.findOne({
    _id: useId,
  })

  const requestFriend = myUser.requestFriend
  const acceptFriend = myUser.acceptFriend
  //socket
  usersSocket(res)
  // end socket
  const users = await User.find({
    $and: [
      { _id: { $ne: useId } },
      { _id: { $nin: requestFriend } },
      { _id: { $nin: acceptFriend } },
    ],
    status: 'active',
    deleted: false,
  })

  res.render('client/pages/users/not-friend', {
    titlePage: 'danh sách người dùng',
    users: users,
  })
}
