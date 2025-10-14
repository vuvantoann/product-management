//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector('#form')

if (formSendData) {
  formSendData.addEventListener('submit', (e) => {
    e.preventDefault()
    const content = e.target.elements.content.value
    if (content) {
      socket.emit('CLIENT_SEND_MESSAGE', content)
      e.target.elements.content.value = ''
    }
  })
}
//END CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE

socket.on('SERVER_RETURN_MESSAGE', (data) => {
  console.log('📩 Tin nhắn mới:', data)

  const body = document.querySelector('.chat #messages')
  const myId = document.querySelector('[my-id]').getAttribute('my-id')

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
  body.appendChild(div)

  // Scroll xuống cuối cùng mỗi khi có tin nhắn mới
  body.scrollTop = body.scrollHeight
})

//END SERVER_RETURN_MESSAGE

const bodyChat = document.querySelector('.chat #messages')
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight
}
