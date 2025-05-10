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

// sử lý form multi sau khi đã checked để thay đỏi trạng thái
const formChangeMulti = document.querySelector('.form-change-multi')
if (formChangeMulti) {
  formChangeMulti.addEventListener('submit', (e) => {
    e.preventDefault()
    const checkboxMulti = document.querySelector('[checkbox-multi]')
    const inputsChecked = checkboxMulti.querySelectorAll(
      'input[name="id"]:checked'
    )

    if (inputsChecked.length > 0) {
      const inputIds = formChangeMulti.querySelector('input[name="ids"]')
      let ids = []
      inputsChecked.forEach((input) => {
        ids.push(input.value)
      })

      inputIds.value = ids.join(', ')
      formChangeMulti.submit()
    } else {
      alert('bạn cần chọn 1 ô trước ')
    }
  })
}
// end form multi
