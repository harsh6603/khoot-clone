let CustomError = require("../utils/CustomError");

let errHandler = (err,req,res,next) => {

    if(err instanceof CustomError)
    {        
        return res.status(err.status).json({
            error:{
                message: err.msg,
                status: err.status
            }
        })
    }
    else
    {
        res.status(500).json({
            error:{
                message: err.message,
                status: 500
            }
        })
    }
}

module.exports = errHandler