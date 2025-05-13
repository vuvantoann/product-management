// logic thay đổi trạng thái của từng sản phẩm

const buttonChangeStatus = document.querySelectorAll('[button-change-status]')
const formChangeStatus = document.querySelector('#form-change-status')

if (buttonChangeStatus.length > 0) {
  const path = formChangeStatus.getAttribute('path')
  buttonChangeStatus.forEach((button) => {
    button.addEventListener('click', () => {
      const status = button.getAttribute('data-status')
      const id = button.getAttribute('data-id')
      let statusChange = status == 'active' ? 'inactive' : 'active'

      const action = path + `${statusChange}/${id}?_method=PATCH`
      formChangeStatus.action = action
      formChangeStatus.submit()
    })
  })
}

// end phần trên

// logic thay đổi trạng thái nhiều sản phẩm

const checkboxMulti = document.querySelector('[checkbox-multi]')
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector('input[name="checkAll"]')
  const inputIds = checkboxMulti.querySelectorAll('input[name="id"]')

  // phần check all
  inputCheckAll.addEventListener('click', () => {
    inputIds.forEach((inputItem) => {
      if (inputCheckAll.checked) {
        inputItem.checked = true
      } else {
        inputItem.checked = false
      }
    })
  })

  // phần check từng ô
  inputIds.forEach((inputItem) => {
    inputItem.addEventListener('click', () => {
      const countInputChecked = checkboxMulti.querySelectorAll(
        'input[name="id"]:checked'
      )

      if (countInputChecked.length == inputIds.length) {
        inputCheckAll.checked = true
      } else {
        inputCheckAll.checked = false
      }
    })
  })
}

// end phần này

// Mở và đóng dropdown
const toggleButton = document.getElementById('dropdownToggle')
const dropdownMenu = document.getElementById('dropdownMenu')

toggleButton.addEventListener('click', function (e) {
  e.stopPropagation()
  dropdownMenu.classList.toggle('show')
})

window.addEventListener('click', function (e) {
  if (!dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('show')
  }
})

// Xử lý form
const formChangeMulti = document.querySelector('.form-change-multi')
const dropdownItems = document.querySelectorAll('.dropdown-item')

dropdownItems.forEach((item) => {
  item.addEventListener('click', function (e) {
    e.preventDefault()

    const checkboxMulti = document.querySelector('[checkbox-multi]')
    const inputsChecked = checkboxMulti.querySelectorAll(
      'input[name="id"]:checked'
    )

    if (inputsChecked.length === 0) {
      alert('Bạn cần chọn ít nhất một mục')
      dropdownMenu.classList.remove('show')
      return
    }

    // Thu thập ID từ checkbox
    let ids = []
    inputsChecked.forEach((input) => {
      const value = input.value.trim()
      if (value) ids.push(value)
    })

    if (ids.length === 0) {
      alert('Danh sách ID không hợp lệ')
      dropdownMenu.classList.remove('show')
      return
    }

    const inputIds = formChangeMulti.querySelector('input[name="ids"]')
    const inputType = formChangeMulti.querySelector('input[name="type"]')

    inputIds.value = ids.join(',')
    inputType.value = item.value
    dropdownMenu.classList.remove('show')
    formChangeMulti.submit()
  })
})

// logic phần xóa sản phẩm

const buttonDeletes = document.querySelectorAll('[button-delete]')
const buttonCancel = document.querySelector('[button-cancel]')
const buttonConfirm = document.querySelector('[button-confirm]')
const modal = document.querySelector('#modal')
const formDeleteProduct = document.querySelector('#form-delete-product')
let currentId = null
if (buttonDeletes.length > 0) {
  const path = formDeleteProduct.getAttribute('path')

  buttonDeletes.forEach((button) => {
    button.addEventListener('click', () => {
      modal.style.display = 'flex'

      currentId = button.getAttribute('data-id')
      const action = path + `${currentId}?_method=DELETE`
      formDeleteProduct.action = action
    })
  })
}

buttonConfirm.addEventListener('click', () => {
  if (currentId) {
    formDeleteProduct.submit()
  }
})

buttonCancel.addEventListener('click', () => {
  modal.style.display = 'none'
})

// end logic phần xóa sản phẩm
