const User =require('../models/User');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncsErrors = require('../middlewares/catchAsyncsErrors')
const sendToken =require('../utils/jwToken')
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary')

//register user =>/api/v1/register
exports.registerUser = catchAsyncsErrors (async(req, res , next)=>{

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder :'avatars',
        width :150,
        crop :'scale',//for height
    })

    const {name,email, password} =req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{public_id :result.public_id ,url : result.secure_url}
    });

 sendToken(user, 200,res)

})


//login user =>/api/v1/login

exports.loginUser = catchAsyncsErrors (async(req, res , next)=>{

    const {email, password} =req.body;
   // check if user enter email and password
    if(!email || !password) {
        return next(new ErrorHandler('please enter email and password',  400))
            }
    //find user 
    const user = await User.findOne({email}).select('+password')

    if(!user) {
        return next(new ErrorHandler('invalid email or password',  401))
            }
    // check password 
    const isPasswordMatched  = await user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler('invalid email or password',  401))
    }
    sendToken(user, 200,res)
})

// Forgot Password   =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncsErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

})



// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncsErrors(async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})


//Get current user info => /api/v1/me
exports.getUserProfile  = catchAsyncsErrors (async(req, res , next)=>{

    const user = await User.findById(req.user.id) //current user id (see middelware auth file)

    res.status(200).json({status:true,user})
})


// Update / Change password   =>  /api/v1/password/update
exports.updatePassword = catchAsyncsErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

})



// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncsErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if (req.body.avatar !=="")
    {
        const user = await User.findById(req.user.id)
        const image_id = user.avatar[0].public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder :'avatars',
            width :150,
            crop :'scale',//for height
        })

        newUserData.avatar={
            public_id : result.public_id,
            url:result.secure_url
        }

    }




    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})




//logout user =>/api/v1/logout

exports.logoutUser = catchAsyncsErrors (async(req, res , next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly: true
    })
   res.status(200).json({
       success: true,
       message: 'logged out'
   })
   })



// Admin Routes

// Get all users   =>   /api/v1/admin/users

exports.allUsers = catchAsyncsErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Get user details   =>   /api/v1/admin/user/:id

exports.getUserDetails = catchAsyncsErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})


// Update user profile   =>   /api/v1/admin/user/:id

exports.updateUser = catchAsyncsErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})









// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncsErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }
    //delete image from cloudinary
    const image_id = user.avatar[0].public_id;
    await cloudinary.v2.uploader.destroy(image_id); 

    await user.remove();

    res.status(200).json({
        success: true,
    })
})
