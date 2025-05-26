function formatCurrency(number) {
  return Number(number).toLocaleString('vi-VN')
}

module.exports = {
  formatCurrency,
}
