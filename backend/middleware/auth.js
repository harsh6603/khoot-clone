const jwt = require('jsonwebtoken')
const CustomError = require("../utils/CustomError")

const authMiddleware = (req,res,next) => {

    let auth = req.headers['authorization'];
    
    if(!auth)
        throw new CustomError(401,"Authentication required");

    let token = auth.split(" ")[1];    

    if(!token)
        throw new CustomError(401,"Authentication required");
    
    try{
        let decode = jwt.verify(token,process.env.JWT_SECRET)        
        req.user = decode    
        next()
    }
    catch(e)
    {
        throw new CustomError(401,"Invalid jwt")
    }
}

module.exports = authMiddleware;