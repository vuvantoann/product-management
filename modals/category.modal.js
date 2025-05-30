const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)
const categorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: '',
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: 'title', unique: true, slugPaddingSize: 4 },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  }
)

const Category = mongoose.model('Category', categorySchema, 'categories')

module.exports = Category
