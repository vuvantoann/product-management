// permissions
const tablePermission = document.querySelector('[table-permission]')
if (tablePermission) {
  // phần lấy checked trong input checkbox
  const checkAllInputs = tablePermission.querySelectorAll(
    'input[name="checkAll"]'
  )

  checkAllInputs.forEach(function (checkAllInput) {
    // Lấy ô td/th chứa checkAll
    const cell = checkAllInput.closest('td') || checkAllInput.closest('th')
    const rowCells = cell.parentElement.children

    // Tìm vị trí của cột
    let columnIndex = -1
    for (let i = 0; i < rowCells.length; i++) {
      if (rowCells[i] === cell) {
        columnIndex = i
        break
      }
    }

    // Lấy tất cả checkbox trong đúng cột ở phần tbody
    const allRows = tablePermission.querySelectorAll('tbody tr')
    const columnCheckboxes = []

    allRows.forEach(function (row) {
      const cells = row.children
      if (cells[columnIndex]) {
        const checkbox = cells[columnIndex].querySelector('input[name="id"]')
        if (checkbox) {
          columnCheckboxes.push(checkbox)
        }
      }
    })

    // Khi bấm checkAll: check/uncheck tất cả checkbox trong cùng cột
    checkAllInput.addEventListener('click', function () {
      columnCheckboxes.forEach(function (checkbox) {
        checkbox.checked = checkAllInput.checked
      })
    })

    // Khi bấm vào từng ô checkbox
    columnCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('click', function () {
        const allChecked = columnCheckboxes.every(function (cb) {
          return cb.checked
        })
        checkAllInput.checked = allChecked
      })
    })
  })

  //end  phần lấy checked trong input checkbox

  // logic gửi dữ liệu lên backend
  const buttonSubmit = document.querySelector('[button-submit]')
  buttonSubmit.addEventListener('click', () => {
    let permissions = []
    const rows = tablePermission.querySelectorAll('[data-name]')

    rows.forEach((row) => {
      const name = row.getAttribute('data-name')
      const inputs = row.querySelectorAll('input')

      if (name == 'id') {
        inputs.forEach((input) => {
          const id = input.value
          permissions.push({
            id: id,
            permissions: [],
          })
        })
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked

          if (checked) {
            permissions[index].permissions.push(name)
          }
        })
      }
    })
    console.log(permissions)
    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector(
        '#form-change-permissions'
      )
      const inputPermissions = formChangePermissions.querySelector(
        "[name='permissions']"
      )
      inputPermissions.value = JSON.stringify(permissions)
      formChangePermissions.submit()
    }
  })
}
//end permissions

// permissions preview data
const dataRoles = document.querySelector('[data-roles')
if (dataRoles) {
  const roles = JSON.parse(dataRoles.getAttribute('data-roles'))
  const tablePermission = document.querySelector('[table-permission]')
  roles.forEach((item, index) => {
    const permissions = item.permissions
    permissions.forEach((permission) => {
      const row = tablePermission.querySelector(`[data-name=${permission}]`)
      const input = row.querySelectorAll('input')[index]
      input.checked = true
    })
  })
}

// end permissions preview data
