const { priceNewProduct } = require('../../helper/product')
const Product = require('../../modals/product.modal')

// [GET] /
module.exports.index = async (req, res) => {
  try {
    const productFeatured = await Product.find({
      featured: '1',
      status: 'active',
      deleted: false,
    }).limit(8)

    const newProducts = priceNewProduct(productFeatured)

    res.render('client/pages/home/index', {
      titlePage: 'Trang chủ',
      products: newProducts,
    })
  } catch (error) {
    console.error('Lỗi khi tải trang chủ:', error)
    res.status(500).send('Lỗi máy chủ khi tải trang chủ')
  }
}
