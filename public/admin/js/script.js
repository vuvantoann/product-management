// phần sử lý logic khi toggle button sidebar và active khi sidebar được trỏ
document.addEventListener('DOMContentLoaded', () => {
  const activeArrows = document.querySelectorAll(
    '.menu-item.active .bx-chevron-right'
  )
  activeArrows.forEach((arrow) => arrow.classList.add('rotate'))

  const menuItems = document.querySelectorAll('.sidebar__menu.top .menu-item')
  const submenus = document.querySelectorAll('.submenu')
  const allArrow = document.querySelectorAll('.menu-item .bx-chevron-right')
  const submenuItems = document.querySelectorAll('.submenu li')

  if (menuItems) {
    menuItems.forEach((item) => {
      item.addEventListener('click', () => {
        const submenu = item.nextElementSibling
        const arrow = item.querySelector('.bx-chevron-right')
        // let isOpen = false
        // if (submenu && submenu.style.display === 'flex') {
        //   isOpen = true
        // }
        if (item.classList.contains('active')) return

        // reset
        menuItems.forEach((itemMenu) => itemMenu.classList.remove('active'))
        submenus.forEach((itemSub) => (itemSub.style.display = 'none'))
        allArrow.forEach((itemArrow) => itemArrow.classList.remove('rotate'))

        item.classList.add('active')
        if (submenu && submenu.classList.contains('submenu')) {
          submenu.style.display = 'flex'
          arrow?.classList.add('rotate')
        }
      })
    })
  }

  if (submenuItems) {
    submenuItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        submenuItems.forEach((i) => {
          i.classList.remove('active')
        })
        item.classList.add('active')
      })
    })
  }
})
// end  phần sử lý logic khi toggle button sidebar và active khi sidebar được trỏ

// Phần sử lý logic show sidebar

document.addEventListener('DOMContentLoaded', () => {
  const menuBar = document.querySelector('#content nav .bx.bx-menu')
  const sidebar = document.querySelector('.sidebar')
  const submenus = document.querySelectorAll('.submenu')
  const menuItems = document.querySelectorAll('.sidebar__menu.top .menu-item')
  const sidebarState = localStorage.getItem('sidebar') // 'hide' hoặc 'show'
  if (sidebarState === 'hide') {
    menuItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (sidebar.classList.contains('hide')) {
          sidebar.classList.remove('hide')
          localStorage.setItem('sidebar', 'show')
        }

        // const submenu = item.nextElementSibling
        // if (submenu && submenu.classList.contains('submenu')) {
        //   submenu.style.display = 'flex'
        // }
      })
    })
    sidebar.classList.add('hide')

    submenus.forEach((ul) => {
      ul.style.display = 'none'
    })
  }

  if (window.innerWidth < 768) {
    sidebar.classList.add('hide')
    submenus.forEach((ul) => (ul.style.display = 'none'))
  }

  menuBar.addEventListener('click', () => {
    sidebar.classList.toggle('hide')
    if (sidebar.classList.contains('hide')) {
      submenus.forEach((ul) => (ul.style.display = 'none'))
      localStorage.setItem('sidebar', 'hide')
    } else {
      const activeParent = document.querySelector(
        '.menu-item.active + .submenu'
      )
      if (activeParent) activeParent.style.display = 'flex'
      localStorage.setItem('sidebar', 'show')
    }
  })
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

// sử lý logic sắp xếp sản phẩm theo từng tiếu chí
const sortSelect = document.getElementById('sort-select')

if (sortSelect) {
  const url = new URL(window.location.href)
  sortSelect.addEventListener('change', (e) => {
    const [sortKey, sortValue] = e.target.value.split('-')

    if (e.target.value) {
      url.searchParams.set('sortKey', sortKey)
      url.searchParams.set('sortValue', sortValue)
    } else {
      url.searchParams.delete('sortKey')
      url.searchParams.delete('sortValue')
    }

    window.location.href = url.href
  })

  const sortKey = url.searchParams.get('sortKey')
  const sortValue = url.searchParams.get('sortValue')

  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`

    const OptionSelected = sortSelect.querySelector(
      `option[value='${stringSort}']`
    )
    OptionSelected.selected = true
  }
}

//kết thúc sắp xếp sản phẩm theo từng tiếu chí

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

// logic alert
document.querySelectorAll('.alert-container').forEach((container) => {
  const span = container.querySelector('span')
  const close = container.querySelector('.close')
  const time = parseInt(container.getAttribute('data-time')) || 5000
  span.style.animationDuration = time + 'ms'
  span.addEventListener('animationend', () => {
    span.style.display = 'none'
  })

  const timeout = setTimeout(() => {
    container.classList.add('hide')

    setTimeout(() => {
      container.style.display = 'none'
    }, 500)
  }, time)

  close.addEventListener('click', () => {
    clearTimeout(timeout)
    container.classList.add('hide')
  })
})
// end logic alert
