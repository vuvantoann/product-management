import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector('#form')
let timeOut

if (formSendData) {
  formSendData.addEventListener('submit', (e) => {
    e.preventDefault()
    const content = e.target.elements.content.value
    if (content) {
      socket.emit('CLIENT_SEND_MESSAGE', content)
      e.target.elements.content.value = ''
      clearTimeout(timeOut)
      socket.emit('CLIENT_SEND_TYPING', 'hidden')
    }
  })
}
//END CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE

socket.on('SERVER_RETURN_MESSAGE', (data) => {
  const body = document.querySelector('.chat #messages')
  const myId = document.querySelector('[my-id]').getAttribute('my-id')
  const boxTyping = document.querySelector('.chat .inner-list-typing')

  // Tạo phần tử chứa tin nhắn
  const div = document.createElement('div')
  div.classList.add('chat-message')

  const isSent = myId === data.userId // 👈 xác định tin mình gửi hay nhận
  div.classList.add(isSent ? 'sent' : 'received')

  // Render HTML giống Pug
  if (!isSent) {
    // 👉 Tin nhắn nhận
    div.innerHTML = `
      <img class="avatar" src="https://i.pravatar.cc/40?img=1" alt="${data.fullName}">
      <div class="message-content">
        <div class="message-name">${data.fullName}</div>
        <div class="message-text">${data.content}</div>
        <div class="message-time">${data.time}</div>
      </div>
    `
  } else {
    // 👉 Tin nhắn mình gửi
    div.innerHTML = `
      <div class="message-content">
        <div class="message-text">${data.content}</div>
        <div class="message-time">${data.time}</div>
      </div>
    `
  }

  // Gắn vào cuối danh sách tin nhắn
  body.insertBefore(div, boxTyping)

  // Scroll xuống cuối cùng mỗi khi có tin nhắn mới
  body.scrollTop = body.scrollHeight
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
