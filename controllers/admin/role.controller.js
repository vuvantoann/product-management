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
