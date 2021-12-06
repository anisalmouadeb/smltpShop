const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncsErrors = require('../middlewares/catchAsyncsErrors')
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')


//create and save product =>/api/v1/admin/product/new
exports.newProduct = catchAsyncsErrors(async (req, res, next) => {
    let images =[]
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    }else{
        images = req.body.images
    }
    let imagesLinks = []

    for(let i=0; i<images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder:'products'
        })
        imagesLinks.push({
            public_id : result.public_id,
            url : result.secure_url
        })
    }
    req.body.images=imagesLinks

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product })
})



//get all products =>/api/v1/products
exports.getProducts = catchAsyncsErrors(async (req, res, next) => {

    const resPerPage = 8;
    const productCount = await Product.countDocuments()
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();
    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;
    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;

    res.status(200).json({ success: true, productCount, products, resPerPage, filteredProductsCount })



})


//get all products =>/api/v1/promoPproducts
exports.getPromoProducts = catchAsyncsErrors(async (req, res, next) => {
    const products = await Product.find()

    prod = products.filter(p =>p.inPromo === true)

   

    res.status(200).json({ success: true, prod })

})




//get all products ADMIN =>/api/v1/admin/products
exports.getAdminProducts = catchAsyncsErrors(async (req, res, next) => {


    const products = await Product.find()

    res.status(200).json({ success: true, products })



})


//get single product =>/api/v1/product/:id
exports.getSingleProduct = catchAsyncsErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {

        return next(new ErrorHandler("product not found", 404))
    }
    res.status(200).json({ success: true, product })
})



//update product  =>/api/v1/admin/product/:id
exports.updateProduct = catchAsyncsErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {

        return next(new ErrorHandler("product not found", 404))
    }

    let images =[]
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    }else{
        images = req.body.images
    }
    if(images !== undefined)
    {
        // deleting images 

    for(let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    let imagesLinks = []

    for(let i=0; i<images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder:'products'
        })
        imagesLinks.push({
            public_id : result.public_id,
            url : result.secure_url
        })
    }
    req.body.images=imagesLinks

    }
   


    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true, useFindAndModify: false
    });
    res.status(200).json({
        success: true, product
    });
})




//update promo product  =>/api/v1/admin/product/promo/:id
exports.updatePromo = catchAsyncsErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {

        return next(new ErrorHandler("product not found", 404))
    }

    product.inPromo=true;
    product.newPrice = product.price- ((product.price* req.body.percentage)/100 ) 
  product.promoPer = req.body.percentage
    product.save();
    res.status(200).json({ 
        success: true, product
    });
})

//delete promo product  =>/api/v1/admin/product/deletePromo/:id
exports.deletePromo = catchAsyncsErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {

        return next(new ErrorHandler("product not found", 404))
    }

    product.inPromo=false;
    product.newPrice = 0
    product.promoPer = 0
    product.save()
    res.status(200).json({ 
        success: true, product
    });
})




//delete product  =>/api/v1/admin/product/:id
exports.deleteProduct = catchAsyncsErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {

        return next(new ErrorHandler("product not found", 404))
    }

    // deleting images 

    for(let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.remove();
    res.status(200).json({
        success: true, message: 'product deleted'
    });
})


// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncsErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})



// Get product reviews =>   /api/v1/reviews
exports.getProductReview = catchAsyncsErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id)
    const reviews = product.reviews;
    res.status(200).json({
        success: true,
        reviews
    })

})




// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncsErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})