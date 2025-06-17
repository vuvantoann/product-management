const { formatCurrency } = require('./format')

// Xử lý 1 sản phẩm
function priceNewSingleProduct(product) {
  const priceNew = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(0)

  return {
    ...product.toObject(),
    price: formatCurrency(product.price),
    priceNew: formatCurrency(priceNew),
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
