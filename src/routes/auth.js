const express = require("express")
const router = express.Router();

const {
    createAccount,
    getSignUp,
    getLogin,
} = require("../controllers/auth")

router.get("/signup", getSignUp)

router.get("/login", getLogin)

router.post("/create-account", createAccount)


module.exports = router