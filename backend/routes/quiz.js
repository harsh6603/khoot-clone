const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/auth")
const quizControl = require("../controller/quiz")

const {createQuiz,getQuiz} = quizControl

router.post("/",authMiddleware,createQuiz)

router.get("/",authMiddleware,getQuiz)

module.exports = router