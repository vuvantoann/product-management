const Role = require('../../modals/role.modal')
const systemConfig = require('../../config/system')
//[get]admin/role
module.exports.role = async (req, res) => {
  let find = {
    deleted: false,
  }
  const roles = await Role.find(find)
  res.render('admin/pages/role/role-list/index', {
    title: 'Vai trò',
    activePage: 'setting',
    roles: roles,
  })
}

//[get]admin/role/create
module.exports.createRole = (req, res) => {
  res.render('admin/pages/role/add-role/create', {
    title: 'Thêm quyền',
    activePage: 'setting',
  })
}

//[post]admin/role/create
module.exports.createRolePost = async (req, res) => {
  try {
    const newRole = new Role(req.body)
    await newRole.save()

    res.redirect(`${systemConfig.prefixAdmin}/role`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Tạo nhóm quyền thất bại' })
  }
}

//[get]admin/role/permissions
module.exports.permissions = async (req, res) => {
  try {
    let find = {
      deleted: false,
    }
    const roles = await Role.find(find)
    res.render('admin/pages/role/permissions/index', {
      title: 'Phân quyền',
      activePage: 'setting',
      roles: roles,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi trang' })
  }
}

//[patch]admin/role/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions)
    for (item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
    }
    req.flash('success', 'Bạn đã cập nhật phân quyền thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi trang' })
  }
}
