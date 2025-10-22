const User = require('../../modals/user.modal')

module.exports.notFriend = async (req, res) => {
  const useId = res.locals.user.id

  const users = await User.find({
    _id: { $ne: useId },
    status: 'active',
    deleted: false,
  })

  res.render('client/pages/users/not-friend', {
    titlePage: 'danh sách người dùng',
    users: users,
  })
}
