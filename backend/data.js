// backend/data.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DataSchema = new Schema(
  {
    id: Number,
    message: String
  },
  {
    timestamps: true
  }
)

// Export the schema so we can modify it
module.exports = mongoose.model('Data', DataSchema)