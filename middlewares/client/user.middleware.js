const User = require('../../modals/user.modal')

module.exports.userInfo = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      status: 'active',
      deleted: false,
    }).select('-password')

    if (user) {
      res.locals.user = user
    }
  }

  next()
}
