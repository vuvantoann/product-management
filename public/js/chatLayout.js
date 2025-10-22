document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.sidebar__menu.top .menu-item')
  const submenus = document.querySelectorAll('.submenu')
  const allArrow = document.querySelectorAll('.menu-item .bx-chevron-right')
  const submenuItems = document.querySelectorAll('.submenu li')

  // Khi click vào menu chính
  if (menuItems) {
    menuItems.forEach((item) => {
      item.addEventListener('click', () => {
        const submenu = item.nextElementSibling
        const arrow = item.querySelector('.bx-chevron-right')

        if (item.classList.contains('active')) return

        // reset
        menuItems.forEach((i) => i.classList.remove('active'))
        submenus.forEach((ul) => (ul.style.display = 'none'))
        allArrow.forEach((a) => a.classList.remove('rotate'))

        // set active mới
        item.classList.add('active')
        if (submenu && submenu.classList.contains('submenu')) {
          submenu.style.display = 'flex'
          arrow?.classList.add('rotate')
        }
      })
    })
  }

  // Khi click submenu
  if (submenuItems) {
    submenuItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        submenuItems.forEach((i) => i.classList.remove('active'))
        item.classList.add('active')
      })
    })
  }
})
