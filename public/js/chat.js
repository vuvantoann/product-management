import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector('#form')
const inputUpload = document.querySelector('#file-upload')
const imagesPreview = document.querySelector('.form-image .images')
let timeOut
let files = []

if (inputUpload) {
  inputUpload.addEventListener('change', () => {
    files = Array.from(inputUpload.files)
  })
}

if (formSendData) {
  formSendData.addEventListener('submit', (e) => {
    e.preventDefault()
    const content = e.target.elements.content.value.trim()

    if (content || files.length > 0) {
      socket.emit('CLIENT_SEND_MESSAGE', {
        content: content || null,
        images: files,
      })

      // reset
      e.target.elements.content.value = ''
      inputUpload.value = ''
      files = []

      if (imagesPreview) {
        imagesPreview.innerHTML = ''
      }
      clearTimeout(timeOut)
      socket.emit('CLIENT_SEND_TYPING', 'hidden')
    }
  })
}

//END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
  const body = document.querySelector('.chat #messages')
  const myId = document.querySelector('[my-id]').getAttribute('my-id')
  const boxTyping = document.querySelector('.chat .inner-list-typing')

  const div = document.createElement('div')
  div.classList.add('chat-message')

  const isSent = myId === data.userId
  div.classList.add(isSent ? 'sent' : 'received')

  // Avatar (chỉ có khi là người khác gửi)
  let html = ''
  if (!isSent) {
    html += `<img class="avatar" src="https://i.pravatar.cc/40?img=1" alt="${data.fullName}">`
  }

  // Bọc nội dung chính
  html += `<div class="message-wrapper">`

  // Tên người gửi (nếu là người khác)
  if (!isSent) {
    html += `<div class="message-name">${data.fullName}</div>`
  }

  // Nếu có content → hiển thị khung message-content
  if (data.content) {
    html += `
      <div class="message-content">
        <div class="message-text">${data.content}</div>
      </div>
    `
  }

  // Nếu có ảnh → hiển thị block ảnh riêng (không nền)
  if (data.images && data.images.length > 0) {
    html += `
      <div class="message-images">
        ${data.images
          .map(
            (image) =>
              `<img class="message-image" src="${image}" alt="image" />`
          )
          .join('')}
      </div>
    `
  }

  // Time luôn nằm cuối cùng
  html += `<div class="message-time">${data.time}</div></div>`

  div.innerHTML = html

  // Gắn vào danh sách tin nhắn
  body.insertBefore(div, boxTyping)

  // Cuộn xuống cuối cùng
  body.scrollTop = body.scrollHeight

  //view image
  const gallery = new Viewer(div)
})

//END SERVER_RETURN_MESSAGE

const bodyChat = document.querySelector('.chat #messages')
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight
}

//show Icon chat
//show popup
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip)

  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
  }
}
//end show popup

// show typing
const showTyping = () => {
  socket.emit('CLIENT_SEND_TYPING', 'show')

  clearTimeout(timeOut)

  timeOut = setTimeout(() => {
    socket.emit('CLIENT_SEND_TYPING', 'hidden')
  }, 3000)
}

// end show typing

//insert icon to input
const emojiPicker = document.querySelector('emoji-picker')
if (emojiPicker) {
  const inputChat = document.querySelector(".chat #form input[name='content']")
  emojiPicker.addEventListener('emoji-click', (event) => {
    const icon = event.detail.unicode
    inputChat.value = inputChat.value + icon
    const end = inputChat.value.length
    inputChat.setSelectionRange(end, end)
    inputChat.focus()
    showTyping()
  })

  //input Keyup
  inputChat.addEventListener('keyup', () => {
    showTyping()
  })
}
//end insert icon to input

// end show Icon chat

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector('.chat .inner-list-typing')

if (elementListTyping) {
  socket.on('SERVER_RETURN_TYPING', (data) => {
    if (data.type == 'show') {
      const existTyping = elementListTyping.querySelector(
        `[user_id='${data.userId}']`
      )
      const body = document.querySelector('.chat #messages')

      if (!existTyping) {
        const div = document.createElement('div')
        div.classList.add('chat-message')
        div.classList.add('received')
        div.classList.add('typing')
        div.setAttribute('user_id', data.userId)
        div.innerHTML = `
        <img class="avatar" src="https://i.pravatar.cc/40?img=1" alt="${data.fullName}">
        <div class="message-content">
          <div class="message-name">${data.fullName}</div>
          <div class="typing-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          
        </div>`
        elementListTyping.appendChild(div)
        body.scrollTop = body.scrollHeight
      }
    } else {
      const removeTyping = elementListTyping.querySelector(
        `[user_id='${data.userId}']`
      )

      if (removeTyping) {
        elementListTyping.removeChild(removeTyping)
      }
    }
  })
}

// END SERVER_RETURN_TYPING

// views images
const bodyViewImage = document.querySelector('.chat #messages')
if (bodyViewImage) {
  const gallery = new Viewer(bodyViewImage)
}
// end views images
