//create send and save token in cookie

const sendToken = (user , stausCode, res)=>{
    const token = user.getJwtToken()

    const options = {
        expires : new Date(Date.now()+ process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly : true,
    }


    res.status(stausCode).cookie('token',token,options).json({ success: true, token,user })
}

module.exports =sendToken;