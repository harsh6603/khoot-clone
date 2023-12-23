const mongoose = require("mongoose")

let questionSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    options:{
        type:[]
    },
    answer:{
        type:[]
    },
    points:{
        type:Number,
        required:true        
    },
    time:{
        type:Number,
        required:true
    },
    quiz:{
        type: mongoose.Types.ObjectId,
        ref: 'quiz'
    }
})

let QuestionModel = new mongoose.model('question',questionSchema)

module.exports = {QuestionModel}