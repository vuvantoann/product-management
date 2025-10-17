// logic upload image
const uploadImage = document.querySelector('[upload-image]')

if (uploadImage) {
  const inputUpload = uploadImage.querySelector('[input-upload]')
  const imageContainer = uploadImage.querySelector('.images')
  const chatBody = document.querySelector('.chat #messages')

  inputUpload.addEventListener('change', () => {
    imageContainer.innerHTML = ''
    const files = Array.from(inputUpload.files)

    if (files.length === 0) {
      imageContainer.style.height = '0'
      imageContainer.style.opacity = '0'
      return
    }

    imageContainer.style.height = 'auto'
    imageContainer.style.opacity = '1'

    files.forEach((file, index) => {
      const item = document.createElement('div')
      item.className = 'preview-item'

      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)
      img.alt = file.name

      const btnRemove = document.createElement('button')
      btnRemove.className = 'remove-btn'
      btnRemove.innerHTML = '<i class="bx bx-x"></i>'

      btnRemove.addEventListener('click', () => {
        item.remove()

        const dt = new DataTransfer()
        const current = Array.from(inputUpload.files).filter(
          (_, i) => i !== index
        )
        current.forEach((f) => dt.items.add(f))
        inputUpload.files = dt.files

        if (!imageContainer.children.length) {
          imageContainer.style.height = '0'
          imageContainer.style.opacity = '0'
        }

        // Scroll lại cuối sau khi xóa
        chatBody.scrollTop = chatBody.scrollHeight
      })

      item.appendChild(img)
      item.appendChild(btnRemove)
      imageContainer.appendChild(item)
    })

    // 👇 Auto scroll để hiện preview
    chatBody.scrollTop = chatBody.scrollHeight
  })
}
// end logic upload image
