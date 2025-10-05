const Product = require('../../modals/product.modal')
const Category = require('../../modals/category.modal')
const {
  priceNewProduct,
  priceNewSingleProduct,
} = require('../../helper/product')
const productCategoryHelper = require('../../helper/product-category')

// [GET] /product
module.exports.product = async (req, res) => {
  try {
    const products = await Product.find({
      status: 'active',
      deleted: false,
    }).sort({ position: 'desc' })

    const newProducts = priceNewProduct(products)

    res.render('client/pages/product/product-list/index', {
      titlePage: 'Trang sản phẩm',
      products: newProducts,
    })
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error)
    res.status(500).send('Lỗi máy chủ khi tải sản phẩm')
  }
}

// [GET] /product/detail/:slugProduct
module.exports.detailProduct = async (req, res) => {
  try {
    const slugProduct = req.params.slugProduct
    const product = await Product.findOne({
      slug: slugProduct,
      status: 'active',
      deleted: false,
    })
    if (!product) return res.status(404).send('Không tìm thấy sản phẩm')

    if (product.product_category_id) {
      const category = await Category.findOne({
        _id: product.product_category_id,
        status: 'active',
        deleted: false,
      })

      product.category = category
    }

    const productObj = priceNewSingleProduct(product)
    productObj.category = product.category

    res.render('client/pages/product/product-detail/detail', {
      titlePage: 'Chi tiết sản phẩm',
      product: productObj,
    })
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
    res.status(500).send('Lỗi máy chủ khi tải chi tiết sản phẩm')
  }
}

// [GET] /product/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory

    const category = await Category.findOne({
      slug: slugCategory,
      deleted: false,
      status: 'active',
    })
    if (!category) return res.status(404).send('Không tìm thấy danh mục')

    const listSubCategory = await productCategoryHelper.getSubCategory(
      category._id
    )
    const listSubCategoryId = listSubCategory.map((item) => item.id)

    const products = await Product.find({
      product_category_id: { $in: [category._id, ...listSubCategoryId] },
      deleted: false,
      status: 'active',
    }).sort({ position: 'desc' })

    const newProducts = priceNewProduct(products)

    res.render('client/pages/product/product-list/index', {
      titlePage: category.title,
      products: newProducts,
    })
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo danh mục:', error)
    res.status(500).send('Lỗi máy chủ khi tải sản phẩm theo danh mục')
  }
}
