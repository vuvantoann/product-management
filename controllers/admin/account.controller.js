const Account = require('../../modals/account.modal')
const Role = require('../../modals/role.modal')
const systemConfig = require('../../config/system')
const md5 = require('md5')

//[get]admin/account
module.exports.account = async (req, res) => {
  try {
    let find = {
      deleted: false,
    }
    const accounts = await Account.find(find).select('-password -token')
    for (const account of accounts) {
      const role = await Role.findOne({
        _id: account.role_id,
        deleted: false,
      })
      account.role = role
    }

    res.render('admin/pages/account/account-list/index', {
      title: 'Danh sách tài khoản',
      activePage: 'setting',
      accounts: accounts,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Không có dữ liệu' })
  }
}

//[get]admin/account/create
module.exports.createAccount = async (req, res) => {
  let find = {
    deleted: false,
  }
  const roles = await Role.find(find)
  res.render('admin/pages/account/add-account/create', {
    title: 'Thêm tài khoản',
    activePage: 'setting',
    roles: roles,
  })
}

//[post]admin/account/create
module.exports.createAccountPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    })

    if (emailExist) {
      req.flash('error', `email ${req.body.email} đã tồn tại`)
      res.redirect(req.get('Referer') || '/')
    } else {
      req.body.password = md5(req.body.password)
      const newAccount = new Account(req.body)
      await newAccount.save()

      res.redirect(`${systemConfig.prefixAdmin}/account`)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Tạo tài khoản  thất bại' })
  }
}
