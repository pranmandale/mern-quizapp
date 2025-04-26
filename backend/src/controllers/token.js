export const sendToken = async (user, statusCode, message, res) => {
    const accessToken = await user.generateAccessToken();
    const cookie_expire = process.env.COOKIE_EXPIRE || 1;

    
    
    res.status(statusCode)
        .cookie("accessToken", accessToken, {
            expires: new Date(Date.now() + cookie_expire * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // secure: false,
             sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // <-- FIXED
            // sameSite: "Lax",
            // path: '/'
        })
        .json({
            success: true,
            message,
            user,
            accessToken,
        });


    

};
