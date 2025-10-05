const Setting = require('../../modals/setting.modal')

// [GET] admin/setting
module.exports.setting = async (req, res) => {
  try {
    res.render('admin/pages/setting/index', {
      title: 'Trang cài đặt',
      activePage: 'setting',
    })
  } catch (error) {
    console.error('Lỗi khi tải trang cài đặt:', error)
    res.status(500).send('Lỗi máy chủ khi tải trang cài đặt')
  }
}

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
  try {
    const settingGeneral = await Setting.findOne({}).lean()
    res.render('admin/pages/setting/general', {
      title: 'Cài đặt chung',
      activePage: 'setting',
      settingGeneral: settingGeneral,
    })
  } catch (error) {
    console.error('Lỗi khi tải cài đặt chung:', error)
    res.status(500).send('Lỗi máy chủ khi tải cài đặt chung')
  }
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
    res.status(500).send('Đã xảy ra lỗi máy chủ khi cập nhật cài đặt')
  }
}
