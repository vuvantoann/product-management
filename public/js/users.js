const listBtnAddFriend = document.querySelectorAll('[btn-add-friend]')

if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.user-item').classList.add('add')
      const userId = btn.getAttribute('btn-add-friend')

      socket.emit('CLIENT_ADD_FRIEND', userId)
    })
  })
}
