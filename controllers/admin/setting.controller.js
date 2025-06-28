const Setting = require('../../modals/setting.modal')

//[get]admin/setting
module.exports.setting = (req, res) => {
  res.render('admin/pages/setting/index', {
    title: 'Trang cài đặt',
    activePage: 'setting',
  })
}

//[GET]/admin/setting/general
module.exports.general = async (req, res) => {
  const settingGeneral = await Setting.findOne({})
  res.render('admin/pages/setting/general', {
    title: 'Cài đặt chung',
    activePage: 'setting',
    settingGeneral: settingGeneral,
  })
}

// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  try {
    const existingSetting = await Setting.findOne()

    if (existingSetting) {
      existingSetting.set(req.body)
      await existingSetting.save()
    } else {
      const newSetting = new Setting(req.body)
      await newSetting.save()
    }

    res.redirect(req.get('Referer') || '/')
  } catch (err) {
    console.error('Lỗi khi cập nhật cài đặt:', err)
    res.status(500).send('Đã xảy ra lỗi máy chủ')
  }
}
