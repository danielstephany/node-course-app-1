const User = require("../Models/user")

const getSignUp = (req, res, next) => {
    res.render("auth/signup", { title: "Signup", path: "/auth/signup" })
}

const getLogin = (req, res, next) => {
    res.render("auth/login", { title: "Login", path: "/auth/login" })
}

const createAccount = async (req, res, next) => {
    try {
        const user = new User({
            name:req.body.name, 
            email: req.body.email,
            cart: {items: []}
        })
        await user.save()

        res.redirect("/")
    } catch(e){
        console.log(e)
    }

}

const loginUser = async (req, res, next) => {
    try {
        const user = await User.findByEmail(req.body.email)

        res.redirect("/")
    } catch(e){
        console.log(e)
    }

}

module.exports = {
    createAccount,
    getSignUp,
    getLogin,
    loginUser
}