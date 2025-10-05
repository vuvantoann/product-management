const Role = require('../../modals/role.modal')
const systemConfig = require('../../config/system')

// [GET] admin/role
module.exports.role = async (req, res) => {
  try {
    const find = { deleted: false }
    const roles = await Role.find(find).lean()

    res.render('admin/pages/role/role-list/index', {
      title: 'Vai trò',
      activePage: 'setting',
      roles,
    })
  } catch (error) {
    console.error('Lỗi [GET] /role:', error)
    res.status(500).json({ error: 'Không thể tải danh sách vai trò' })
  }
}

// [GET] admin/role/create
module.exports.createRole = (req, res) => {
  try {
    res.render('admin/pages/role/add-role/create', {
      title: 'Thêm quyền',
      activePage: 'setting',
    })
  } catch (error) {
    console.error('Lỗi [GET] /create-role:', error)
    res.status(500).json({ error: 'Không thể tải trang tạo quyền' })
  }
}

// [POST] admin/role/create
module.exports.createRolePost = async (req, res) => {
  try {
    const { title, description, permissions } = req.body

    if (!title || typeof title !== 'string') {
      req.flash('error', 'Tên vai trò không hợp lệ.')
      return res.redirect(req.get('Referer') || '/')
    }

    const newRole = new Role({
      title: title.trim(),
      description: description?.trim() || '',
      permissions: permissions || [],
    })

    await newRole.save()

    req.flash('success', 'Thêm vai trò mới thành công.')
    res.redirect(`${systemConfig.prefixAdmin}/role`)
  } catch (error) {
    console.error('Lỗi [POST] /create-role:', error)
    res.status(500).json({ error: 'Tạo nhóm quyền thất bại' })
  }
}

// [GET] admin/role/permissions
module.exports.permissions = async (req, res) => {
  try {
    const roles = await Role.find({ deleted: false }).lean()

    res.render('admin/pages/role/permissions/index', {
      title: 'Phân quyền',
      activePage: 'setting',
      roles,
    })
  } catch (error) {
    console.error('Lỗi [GET] /permissions:', error)
    res.status(500).json({ error: 'Không thể tải trang phân quyền' })
  }
}

// [PATCH] admin/role/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    if (!req.body.permissions) {
      req.flash('error', 'Dữ liệu phân quyền không hợp lệ.')
      return res.redirect(req.get('Referer') || '/')
    }

    let permissions
    try {
      permissions = JSON.parse(req.body.permissions)
    } catch (parseError) {
      console.error('Lỗi parse JSON permissions:', parseError)
      req.flash('error', 'Định dạng dữ liệu phân quyền không hợp lệ.')
      return res.redirect(req.get('Referer') || '/')
    }

    // Kiểm tra dữ liệu đầu vào
    if (!Array.isArray(permissions) || permissions.length === 0) {
      req.flash('error', 'Không có quyền nào được gửi lên.')
      return res.redirect(req.get('Referer') || '/')
    }

    // Cập nhật song song các vai trò
    await Promise.all(
      permissions.map((item) =>
        Role.updateOne(
          { _id: item.id },
          { permissions: item.permissions || [] }
        )
      )
    )

    req.flash('success', 'Cập nhật phân quyền thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [PATCH] /permissions:', error)
    res.status(500).json({ error: 'Cập nhật phân quyền thất bại' })
  }
}
