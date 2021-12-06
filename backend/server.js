const app= require('./app');
const connectionDatabase = require('./config/database');
 
const dotenv = require('dotenv')
const cloudinary = require('cloudinary')

//handel uncaught exceptions 
process.on('uncaughtException',err=>{
    console.log('ERROR:'+ err.message )
    console.log('shutting down  due to uncaught exceptions ')
  
        process.exit(1);
    
})



//Setting up config file
dotenv.config({path:'backend/config/config.env'})

//connecting to database
connectionDatabase();
const server = app.listen(process.env.PORT,()=>{console.log('server started on port :'+ process.env.PORT +'in ' +process.env.NODE_ENV)})

//setting up cloudinary configuration

cloudinary.config({

    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})


//handel unhandled promise rejection 
process.on('unhandledRejection',err=>{
    console.log('ERROR:'+ err.message )
    console.log('shutting down the server due to unhandled Rejection')
    server.close(()=>{
        process.exit(1);
    })
})