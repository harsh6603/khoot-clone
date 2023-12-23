const express = require("express")
const router = express.Router()
const questionControl = require("../controller/question")
const authMiddleware = require("../middleware/auth")
const { uploadImage } = require("../upload")
const {createQuestion,getQuestions} = questionControl

router.post("/",authMiddleware,uploadImage.single('image'),createQuestion)

router.get("/:quizId",authMiddleware,getQuestions)

module.exports = router