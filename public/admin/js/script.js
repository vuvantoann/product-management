// phần sử lý logic khi sidebar được trỏ
const allSideMenu = document.querySelectorAll('.sidebar__menu.top li a')
allSideMenu.forEach((item) => {
  const li = item.parentElement

  item.addEventListener('click', () => {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove('active')
    })
    li.classList.add('active')
  })
})
// kết thúc

// Phần sử lý logic show sidebar
const menuBar = document.querySelector('#content nav .bx.bx-menu')
const sidebar = document.querySelector('.sidebar')

document.addEventListener('DOMContentLoaded', () => {
  const sidebarState = localStorage.getItem('sidebar') // 'hide' hoặc 'show'
  if (sidebarState === 'hide') {
    sidebar.classList.add('hide')
  }

  if (window.innerWidth < 768) {
    sidebar.classList.add('hide')
  }
})

menuBar.addEventListener('click', () => {
  sidebar.classList.toggle('hide')
  if (sidebar.classList.contains('hide')) {
    localStorage.setItem('sidebar', 'hide')
  } else {
    localStorage.setItem('sidebar', 'show')
  }
})

// kết thúc

// phần sử lý logic chỗ chế độ sáng tối

const switchMode = document.getElementById('switch-mode')

document.addEventListener('DOMContentLoaded', () => {
  const mode = localStorage.getItem('mode')
  if (mode === 'dark') {
    document.body.classList.add('dark')
    switchMode.checked = true
  } else {
    document.body.classList.remove('dark')
    switchMode.checked = false
  }
})

switchMode.addEventListener('change', () => {
  const isDark = switchMode.checked
  document.body.classList.toggle('dark')
  localStorage.setItem('mode', isDark ? 'dark' : 'light')
})
// kết thúc sử lý logic chỗ chế độ sáng tối

// sử lý logic lọc sản phẩm theo trạng thái
const selectStatus = document.getElementById('status-filter')

if (selectStatus) {
  const urlParams = new URLSearchParams(window.location.search)
  const statusFromUrl = urlParams.get('status')

  if (statusFromUrl !== null) {
    selectStatus.value = statusFromUrl
  } else {
    selectStatus.value = ''
  }

  selectStatus.addEventListener('change', () => {
    const status = selectStatus.value
    const url = new URL(window.location.href)

    if (status) {
      url.searchParams.set('status', status)
    } else {
      url.searchParams.delete('status')
    }

    window.location.href = url.href
  })
}

//kết thúc lọc sản phẩm theo trạng thái

// sử lý logic phầm tìm kiếm
const formSearch = document.querySelector('#form-search')

if (formSearch) {
  const url = new URL(window.location.href)
  formSearch.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const value = formData.get('q')
    console.log(value)
    if (value) {
      url.searchParams.set('keyword', value)
    } else {
      url.searchParams.delete('keyword')
    }
    window.location.href = url.href
  })
}
// kết thúc sử lý logic phầm tìm kiếm

// logic phần pagination
const buttonPagination = document.querySelectorAll('[button-pagination]')

if (buttonPagination) {
  const url = new URL(window.location.href)
  buttonPagination.forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.getAttribute('button-pagination')
      url.searchParams.set('page', page)
      window.location.href = url.href
    })
  })
}
// end logic pagination
