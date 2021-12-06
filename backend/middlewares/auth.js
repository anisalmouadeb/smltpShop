//check if user is authenticated
const User =require("../models/User");
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncsErrors = require("./catchAsyncsErrors");
const jwt = require('jsonwebtoken');
exports.isAuthenticatedUser = catchAsyncsErrors( async (req , res , next ) => {

    const {token }= req.cookies;
    if (!token )
    {
        return next(new ErrorHandler('login first to access to resource',  401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()
   
})

exports.authorizeRoles = (...roles) => {

    return (req, res,next) => {
     
        if(!roles.includes(req.user.role))
        {
            return next(new ErrorHandler('Role'+req.user.role+' not alloued',403)) 
        }
        next()

    }
}