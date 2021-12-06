const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "please enter product name"],
        trim: true,
        maxLength: [100, "product name cannot exceed 100 caracters "]
    },
    price: {
        type: Number,
        required: [true, "please enter product price"],
        default: 0.0
    },
    newPrice: {
        type: Number,
        default: 0.0
    },
    inPromo: {
        type: Boolean,
        default: false,
    },
    promoPer: {
        type: Number,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "please enter product description"],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true }

        }
    ],
    category: {
        type: String,
        required: [true, "please select category to this product"],
        enum: {
            values: ['cat1', 'cat2', 'cat3'],
            message: 'please select correct cat'
        }
    },
    seller: {
        type: String,
        required: [true, "please enter product seller"],
    },
    stock: {
        type: Number,
        required: [true, "please enter product stock"],
        maxLength: [5, "product name cannot exceed 5 caracters "],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user:{

            type: mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true }
    }],
  
    createdAt: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model("Product", productSchema);