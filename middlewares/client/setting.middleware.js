const Setting = require('../../modals/setting.modal')

module.exports.settingGeneral = async (req, res, next) => {
  const settingGeneral = await Setting.findOne({})

  res.locals.settingGeneral = settingGeneral

  next()
}
