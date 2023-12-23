const { QuizModel } = require("../model/quiz")
const CustomError = require("../utils/CustomError")

exports.createQuiz = async(req,res,next) => {

    try{        
        let data = {
            ...req.body,
            author:req.user.id
        }    
        
        let newQuiz = new QuizModel(data)
        let result = await newQuiz.save()
        
        res.json({
            success:true,
            result
        })
    }
    catch(err)
    {
        next(CustomError.catchBlockError(err.message))
    }
}

exports.getQuiz = async(req,res,next) => {
    try{        
        const data = await QuizModel.find({author: req.user.id})
        return res.json({
            success:true,
            data
        })
    }
    catch(err)
    {
        next(CustomError.catchBlockError(err.message))
    }
}

