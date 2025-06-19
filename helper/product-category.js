const Category = require('../modals/category.modal')

module.exports.getSubCategory = async (parentId) => {
  const getCategory = async (parentId) => {
    const subs = await Category.find({
      parent_id: parentId,
      deleted: false,
      status: 'active',
    })
    let allSub = [...subs]
    for (let sub of subs) {
      const children = await getCategory(sub._id)
      allSub = allSub.concat(children)
    }

    return allSub
  }

  const result = await getCategory(parentId)
  return result
}
