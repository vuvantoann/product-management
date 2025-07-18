const Account = require('../../modals/account.modal')
const Role = require('../../modals/role.modal')
const systemConfig = require('../../config/system')

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
  } else {
    const user = await Account.findOne({
      token: req.cookies.token,
    }).select('-password')
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    } else {
      const role = await Role.findOne({
        _id: user.role_id,
      }).select('title permissions')
      res.locals.user = user
      res.locals.role = role

      next()
    }
  }
}
