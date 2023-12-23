const express = require("express")
const router = express.Router();
const {body} = require("express-validator")
const authMiddleware = require("../middleware/auth")
const userControl = require("../controller/user")

router.get("/",(req,res) => {
    res.json({
        message:"hello"
    })
})

router.post("/login",[
    body('email',"Please enter mail").exists().isLength({min:1}),
    body('email',"Please enter valid email.").isEmail(),
    body('password','Please enter password').exists()
],userControl.login)

router.post("/signup",[
    body('name',"please enter name.").exists().isLength({min:1}),
    body('email','please enter email.').exists().isLength({min:1}),
    body('email',"Please enter valid email.").isEmail(),
    body('email',"Please enter valid email").custom(value => {
        return userControl.findUserByEmail(value).then(user => {
            if(user.length != 0){
                return Promise.reject('E-mail already exist.')
            }
        })
    }),
    body('password','please enter password.').exists().isLength({min:1}),
    body('password','please enter strong password.').isStrongPassword(),
],userControl.signup)

module.exports = router;