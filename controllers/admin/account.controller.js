const Account = require('../../modals/account.modal')
const Role = require('../../modals/role.modal')
const systemConfig = require('../../config/system')
const md5 = require('md5')

// [GET] admin/account
module.exports.account = async (req, res) => {
  try {
    const find = { deleted: false }
    const accounts = await Account.find(find).select('-password -token')

    for (const account of accounts) {
      try {
        const role = await Role.findOne({
          _id: account.role_id,
          deleted: false,
        })
        account.role = role
      } catch (err) {
        console.error(`Không thể lấy role cho account ${account._id}:`, err)
        account.role = null
      }
    }

    res.render('admin/pages/account/account-list/index', {
      title: 'Danh sách tài khoản',
      activePage: 'setting',
      accounts,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Không có dữ liệu' })
  }
}

// [GET] admin/account/create
module.exports.createAccount = async (req, res) => {
  try {
    const roles = await Role.find({ deleted: false })
    res.render('admin/pages/account/add-account/create', {
      title: 'Thêm tài khoản',
      activePage: 'setting',
      roles,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Không thể tải trang thêm tài khoản' })
  }
}

// [POST] admin/account/create
module.exports.createAccountPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    })

    if (emailExist) {
      req.flash('error', `Email ${req.body.email} đã tồn tại`)
      return res.redirect(req.get('Referer') || '/')
    }

    req.body.password = md5(req.body.password)
    const newAccount = new Account(req.body)
    await newAccount.save()

    req.flash('success', 'Bạn đã tạo mới tài khoản thành công.')
    res.redirect(`${systemConfig.prefixAdmin}/account`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Tạo tài khoản thất bại' })
  }
}

// [GET] admin/account/edit/:id
module.exports.editAccount = async (req, res) => {
  try {
    const id = req.params.id
    const find = { deleted: false, _id: id }
    const account = await Account.findOne(find)

    if (!account) {
      req.flash('error', 'Tài khoản không tồn tại')
      return res.redirect(`${systemConfig.prefixAdmin}/account`)
    }

    const roles = await Role.find({ deleted: false })

    res.render('admin/pages/account/edit-account/edit', {
      title: 'Chỉnh sửa tài khoản',
      activePage: 'setting',
      account,
      roles,
    })
  } catch (error) {
    console.error(error)
    req.flash('error', 'Lỗi khi tải dữ liệu tài khoản')
    res.redirect(`${systemConfig.prefixAdmin}/account`)
  }
}

// [PATCH] admin/account/edit/:id
module.exports.editAccountPatch = async (req, res) => {
  try {
    const id = req.params.id
    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    })

    if (emailExist) {
      req.flash('error', `Email ${req.body.email} đã tồn tại`)
      return res.redirect(req.get('Referer') || '/')
    }

    if (req.body.password) {
      req.body.password = md5(req.body.password)
    } else {
      delete req.body.password
    }

    await Account.updateOne({ _id: id }, req.body)
    req.flash('success', 'Bạn đã chỉnh sửa tài khoản thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Chỉnh sửa tài khoản thất bại' })
  }
}
