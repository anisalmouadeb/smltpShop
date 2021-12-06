const express = require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');

const bodyparser = require('body-parser');
const cloudinary = require('cloudinary')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv');
// Setting up config file 
//if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
dotenv.config({ path: 'backend/config/config.env' })

app.use(cookieParser())
app.use(bodyparser.urlencoded({extended : true}));
app.use(fileUpload())



//import all routes
const products = require('./route/product')
const auth = require('./route/auth')
const order = require('./route/order')
const payment = require('./route/payment');

app.use('/api/v1',auth)
app.use('/api/v1',products)
app.use('/api/v1',order)
app.use('/api/v1', payment)


//errors handler
const errorMiddelware = require('./middlewares/errors')
app.use(errorMiddelware);

module.exports =app