function createTree(arr, parentId = '') {
  const tree = []

  arr.forEach((item) => {
    // Chuyển document Mongoose sang plain object
    const obj = item.toObject ? item.toObject() : { ...item }

    if ((obj.parent_id || '').toString() === parentId.toString()) {
      const children = createTree(arr, obj._id?.toString() || '')
      if (children.length > 0) obj.children = children
      tree.push(obj)
    }
  })

  return tree
}

module.exports.tree = (arr, parentId = '') => {
  if (!Array.isArray(arr)) return []
  return createTree(arr, parentId)
}
