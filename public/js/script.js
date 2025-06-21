const sidebarHero = document.querySelector('.hero')
// phần trượt sidebar ở trang chủ
if (sidebarHero) {
  document.addEventListener('DOMContentLoaded', () => {
    const thumbnail = document.querySelector('.hero__thumbnail img')
    const image = document.querySelectorAll('.hero__image')
    const img = document.querySelectorAll('.hero__image img')
    const btnPrev = document.querySelector('.control.prev')
    const btnNext = document.querySelector('.control.next')

    console.log(btnPrev)

    let currentIndex = 0

    function getImageChange(index) {
      currentIndex = index
      thumbnail.src = img[index].getAttribute('src')
    }

    img.forEach((item, index) => {
      item.addEventListener('click', () => {
        thumbnail.style.opacity = '0'
        setTimeout(() => {
          getImageChange(index)
          thumbnail.style.opacity = 1
        }, 500)
      })
    })

    btnPrev.addEventListener('click', () => {
      if (currentIndex === 0) {
        currentIndex = img.length - 1
      } else {
        currentIndex--
      }
      thumbnail.style.animation = ''
      setTimeout(() => {
        getImageChange(currentIndex)
        thumbnail.style.animation = `slide-right 1s ease-in-out forwards`
      }, 500)
    })

    btnNext.addEventListener('click', () => {
      if (currentIndex === img.length - 1) {
        currentIndex = 0
      } else {
        currentIndex++
      }
      thumbnail.style.animation = ''
      setTimeout(() => {
        getImageChange(currentIndex)
        thumbnail.style.animation = `slide-left 1s ease-in-out forwards`
      }, 500)
    })

    getImageChange(0)
  })
}

// sử lý phần tăng giảm số lượng sản phẩm

if (!window.location.pathname.includes('/cart')) {
  const quantityButtons = document.querySelectorAll('.quantity-btn')

  quantityButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Lấy input tương ứng với nút này
      const quantityInput =
        button.parentElement.querySelector('.quantity-display')

      if (!quantityInput) return

      let currentValue = parseInt(quantityInput.value)
      const maxValue = parseInt(quantityInput.max)
      const isDecreaseButton = button.querySelector('.bx-minus')

      currentValue = isDecreaseButton
        ? Math.max(1, currentValue - 1) // Không nhỏ hơn 1
        : Math.min(maxValue, currentValue + 1) // Không vượt quá max

      quantityInput.value = currentValue
    })
  })
}
