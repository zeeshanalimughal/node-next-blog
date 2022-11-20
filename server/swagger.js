const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./router/routes.js']

swaggerAutogen(outputFile, endpointsFiles,{
    info: {
        "title": "MERN BLOG APP REST API",
        "description": "Node js Rest api for blogging application."
      },
    host:'localhost:4000',
    basePath:'/api'
}).then(() => {
    require('./app.js')
})