const Product =require('../models/Product');
const connectionDatabase = require('../config/database');
const dotenv = require('dotenv');
const products =require("../data/products")
//env setting
dotenv.config({path:'backend/config/config.env'})

connectionDatabase();

const seedProducts = async () =>{

    try{
        await Product.deleteMany();
        console.log('Product deleted');
        await Product.insertMany(products);
        console.log('Products added');
        process.exit();
    }catch(error){
        console.log(error.message);
        process.exit();
    }

}
seedProducts();