// logic upload image
const uploadImage = document.querySelector('[upload-image]')
if (uploadImage) {
  const inputUpload = uploadImage.querySelector('[input-upload]')
  const numOfFiles = uploadImage.querySelector('.num-of-files')
  const imageContainer = uploadImage.querySelector('.images')

  inputUpload.addEventListener('change', () => {
    imageContainer.innerHTML = ''
    numOfFiles.textContent = `${inputUpload.files.length} file đã được chọn `

    for (let file of inputUpload.files) {
      const fileItem = document.createElement('div')
      fileItem.className = 'file-item'

      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)

      const fileName = document.createElement('div')
      fileName.className = 'file-name'
      fileName.textContent = file.name

      const fileSize = document.createComment('div')
      fileSize.className = 'file-size'
      fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`

      const btnRemove = document.createElement('button')
      btnRemove.textContent = 'Remove file'
      btnRemove.addEventListener('click', () => {
        fileItem.remove()
      })

      fileItem.appendChild(img)
      fileItem.appendChild(fileName)
      fileItem.appendChild(fileSize)
      fileItem.appendChild(btnRemove)

      imageContainer.appendChild(fileItem)
    }
  })
}
//end logic upload image
