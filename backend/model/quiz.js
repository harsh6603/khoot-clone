const mongoose = require("mongoose")

let quizSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
})

let QuizModel = new mongoose.model('quiz',quizSchema)

module.exports = {QuizModel}