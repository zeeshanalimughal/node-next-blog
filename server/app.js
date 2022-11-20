require('./db').connect()
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express')
const config = require('./config/index')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rfs = require("rotating-file-stream");
const ErrorMiddleware = require('./middlewares/errors')
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const path = require('path')
const app = express()


// Middlewares
app.use(express.static(path.join(__dirname, 'public','uploads')))
app.use(cookieParser());
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "*"
}))
app.use(mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
    replaceWith: '_'
  }))

  
// MORGAN SETUP
const rfsStream = rfs.createStream(config.LOG_FILE || 'log.txt', {
    size: config.LOG_SIZE || '30M',
    interval: config.LOG_INTERVAL || '1d',
    compress: 'gzip' // compress rotated files
 });

app.use(morgan(config.LOG_FORMAT || "dev", {
    stream: config.LOG_FILE ? rfsStream : process.stdout
 }));
 

 if(config.LOG_FILE) {
    app.use(morgan(config.LOG_FORMAT || "dev"));    
 }



//  Error Handler Middleware
app.use(ErrorMiddleware)


// Swagger Api Documentation Endpoint
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


// Routes

app.use('/api', require('./router/routes'))


module.exports = app