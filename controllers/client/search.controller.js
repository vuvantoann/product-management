const Product = require('../../modals/product.modal')
const {
  priceNewProduct,
  priceNewSingleProduct,
} = require('../../helper/product')

// [GET] /search
module.exports.search = async (req, res) => {
  try {
    const keyword = req.query.keyword
    let newProducts = []

    if (keyword) {
      const regex = new RegExp(keyword, 'i')
      const products = await Product.find({
        title: regex,
        status: 'active',
        deleted: false,
      })
      newProducts = priceNewProduct(products)
    }

    res.render('client/pages/search/index', {
      titlePage: 'Kết quả tìm kiếm',
      keyword: keyword,
      products: newProducts,
    })
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sản phẩm:', error)
    res.status(500).send('Lỗi máy chủ khi tìm kiếm sản phẩm')
  }
}
