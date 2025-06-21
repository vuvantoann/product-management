// sử lý logic cập nhật số lượng san phẩm trong giỏ hàng
const quantityControl = document.querySelectorAll('.quantity-control')

if (quantityControl.length > 0) {
  quantityControl.forEach((control) => {
    const input = control.querySelector('input[name="quantity"]')
    const buttons = control.querySelectorAll('.quantity-btn')

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        let quantity = parseInt(input.value)
        const max = parseInt(input.max)
        const isMinus = button.querySelector('.bx-minus')

        quantity = isMinus
          ? Math.max(1, quantity - 1)
          : Math.min(max, quantity + 1)

        input.value = quantity

        const productId = input.getAttribute('product-id')

        // Chuyển hướng cập nhật
        window.location.href = `/cart/update/${productId}/${quantity}`
      })
    })
  })
}
//kết thúc sử lý logic cập nhật số lượng san phẩm trong giỏ hàng
