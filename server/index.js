
const app = require('./app')
const mongoose = require('mongoose')
const config = require('./config/index')




// Server 
mongoose.connection.once("open", function () {
    console.log("Connected To MongoDB")
    app.listen(config.PORT || 4000, () => console.log("server running on http://localhost:%d", config.PORT))
})

mongoose.connection.on("error", function (err) {
    console.log("connection error: " + JSON.stringify(err.message));
})