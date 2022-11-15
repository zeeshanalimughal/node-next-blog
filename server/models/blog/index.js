const mongoose = require('mongoose');

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: { type: String },
    description: { type: String },
    image: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    isFeatured: { type: Boolean, default: false },
    tags: [String],
    comments: {
        fromId: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        created_at: { type: Date, default: new Date() },
        updated_at: { type: Date, default: new Date() }
    },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
}, { timestamps: true })
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog