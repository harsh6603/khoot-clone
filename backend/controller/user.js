const userModel = require("../model/user")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const CustomError = require("../utils/CustomError")
SECRET = process.env.JWT_SECRET
const {validationResult} = require("express-validator")

exports.login = async(req,res,next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        let newErr = errors.array();
        return res.status(422).json({
            success: false,
            error: newErr[0].msg
        })        
    }

    try{

        let loginData = req.body;        
        const result = await userModel.User.find({email:loginData.email})
        
        if(result.length==0)
        {
            res.status(401).json({
                success: false,
                error: "Invaild login details."
            });            
        }
        else
        {
            const checkPassword = await bcryptjs.compare(loginData.password,result[0].password)
            if(checkPassword)
            {
                const load = {
                    id: result[0]._id,
                    name: result[0].name,
                    email: result[0].email,                    
                }

                const token = jwt.sign(load,SECRET)

                res.status(200).json({
                    success:true,
                    token,
                    ...load
                })
            }
            else
            {
                res.status(401).json({
                    success:false,
                    error:"Invalid login details."
                })
            }
        }        
    }
    catch(err)
    {
        next(CustomError.catchBlockError(err.message))
    }
}

exports.signup = async(req,res,next) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        let newErr = errors.array();
        return res.status(422).json({
            success: false,
            error: newErr[0].msg
        })
    }

    try{

        let hashPassword = await bcryptjs.hash(req.body.password,10)

        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        }

        const doc = new userModel.User(user)
        const result = await doc.save();
        // console.log(result)
        const data = {
            id: result._id,
            name: result.name,
            email: result.email
        }

        const token = jwt.sign(data,SECRET)

        const response = {
            success: true,
            token: token,
            ...data
        }

        res.json(response)
    }
    catch(err)
    {
        next(CustomError.catchBlockError(err.message))
    }
}

exports.findUserByEmail = (email) => {
    return userModel.User.find({email:email})
}