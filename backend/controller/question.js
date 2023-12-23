const { QuestionModel } = require("../model/question")
const CustomError = require("../utils/CustomError")

let parse = (str) =>{
    try{
        let ans = JSON.parse(str);
        return ans;
    }catch(e){
        return str;
    }
}

exports.createQuestion = async(req,res,next) => {
    try{        
        let body = JSON.parse(JSON.stringify(req.body))
        
        for(let key in body){            
            body[key] = parse(body[key]);
        }
        let newQuestion = new QuestionModel(body)
        let result = await newQuestion.save()
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

exports.getQuestions = async(req,res,next) => {
    try{
        let {quizId} = req.params;
        const data = await QuestionModel.find({quiz:quizId})
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