const thumbnail = document.querySelector('.hero__thumbnail img')
const image = document.querySelectorAll('.hero__image')
const img = document.querySelectorAll('.hero__image img')
const btnPrev = document.querySelector('.prev')
const btnNext = document.querySelector('.next')

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
