const express = require("express")
const {
    check,
    body
} = require("express-validator")
const User = require("../Models/user")

const router = express.Router();

const {
    createAccount,
    getSignUp,
    getLogin,
    postLogin,
    logout,
    resetPassword,
    postResetPassword,
    updatePassword,
    postUpdatePassword
} = require("../controllers/auth")

router.get("/signup", getSignUp)

router.get("/login", getLogin)

router.post(
    "/login", 
    [
        body("email", "invalid email").trim().isEmail().normalizeEmail(),
        body("password", "password is required").trim().not().isEmpty()
    ],
    postLogin
)

router.post(
    "/create-account", 
    [
        body("name", "Name is required").trim().not().isEmpty(),
        check("email").isEmail().normalizeEmail().trim().withMessage("invalid email").custom((email, {req}) => {
            //async validation
            return User.findOne({ email })
            .then(userDoc => {
                if (userDoc){
                    return Promise.reject("Provided email has already been used")
                }
            })
        }), 
        body(
            "password",
            "password should be at least 5 characters."
        ).trim().isLength(5),
        body("password2").trim().custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Passwords do not match")
            }
            return true
        })
    ],
    createAccount
)

router.post("/logout", logout)

router.get("/reset-password", resetPassword)

router.post("/reset-password", postResetPassword)

router.get("/reset-password/:token", updatePassword)

router.post("/update-password", postUpdatePassword)



module.exports = router