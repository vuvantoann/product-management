const { formatCurrency } = require('./format')

// Xử lý 1 sản phẩm
function priceNewSingleProduct(product) {
  const priceRaw = product.price
  const priceNewRaw = Math.floor(
    (priceRaw * (100 - product.discountPercentage)) / 100
  )

  return {
    ...product.toObject(),
    price: formatCurrency(priceRaw), // chuỗi hiển thị
    priceNew: formatCurrency(priceNewRaw), // chuỗi hiển thị
    priceRaw, // số để tính toán
    priceNewRaw, // số để tính toán
  }
}

// Xử lý danh sách sản phẩm
function priceNewProduct(products) {
  return products.map(priceNewSingleProduct)
}

module.exports = {
  priceNewSingleProduct,
  priceNewProduct,
}
