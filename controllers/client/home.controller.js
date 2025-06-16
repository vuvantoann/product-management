const Product = require('../../modals/product.modal')

const { formatCurrency } = require('../../helper/format')

//[get]/
module.exports.index = async (req, res) => {
  const products = await Product.find({
    isItem: true,
    status: 'active',
    deleted: false,
  })

  const newProducts = products.map((item) => {
    const priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0)

    return {
      ...item.toObject(),
      price: formatCurrency(item.price),
      priceNew: formatCurrency(priceNew),
    }
  })

  res.render('client/pages/home/index', {
    titlePage: 'Trang chủ',
    products: newProducts,
  })
}
