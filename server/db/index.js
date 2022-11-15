const mongoose = require('mongoose')
const config = require('../config/index')
exports.connect = async ()=>{
    await mongoose.connect(config.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

