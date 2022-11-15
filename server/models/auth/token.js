const mongoose = require('mongoose');

const Schema = mongoose.Schema

const tokenSchema = new Schema({
    refreshToken: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })
const Token = mongoose.model('Token', tokenSchema)

module.exports = Token