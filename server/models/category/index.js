const mongoose = require('mongoose');

const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true })
const Category = mongoose.model('Category', categorySchema)

module.exports = Category