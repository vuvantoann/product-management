const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)
const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: '',
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    createdBy: {
      account_id: String,
      createdAt: Date,
    },
    slug: { type: String, slug: 'title', unique: true, slugPaddingSize: 4 },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product
