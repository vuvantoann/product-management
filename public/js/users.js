// Chức năng gửi yêu cầu
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
// kết thúc chức năng gửi yêu cầu

// chức năng hủy yêu cầu kết bạn

const listBtnCancelFriend = document.querySelectorAll('[btn-cancel-friend]')

if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.user-item').classList.remove('add')
      const userId = btn.getAttribute('btn-cancel-friend')

      socket.emit('CLIENT_CANCEL_FRIEND', userId)
    })
  })
}
// kết thúc chức năng hủy yêu cầu kết bạn
