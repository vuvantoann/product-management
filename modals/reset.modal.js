const mongoose = require('mongoose')

const resetSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Reset = mongoose.model('Reset', resetSchema, 'resets')

module.exports = Reset
