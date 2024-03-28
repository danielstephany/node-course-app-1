const User = require("../Models/user")
const bcrypt = require("bcryptjs")
const sgMail = require('@sendgrid/mail')
const crypto = require('node:crypto');
const { validationResult } = require("express-validator")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const getSignUp = (req, res, next) => {
    let errorMessages = req.flash('error')
    if (errorMessages) errorMessages = { main: errorMessages[0] }
    res.render("auth/signup", { 
        title: "Signup", 
        path: "/auth/signup",
        errorMessages: errorMessages || {},
        cachedValues: { name, email, password, password2 } = req.body
    })
}

const getLogin = (req, res, next) => {
    let error = req.flash('error')
    let errorMessages = {}
    if (Array.isArray(error)) errorMessages = { main: error[0] }
    res.render("auth/login", { 
        title: "Login", 
        path: "/auth/login",
        errorMessages: errorMessages,
        cachedValues: {}
    })
}

const createAccount = async (req, res, next) => {
    let errors = validationResult(req)
    
    if (!errors.isEmpty()){
        const errorMessageObj = {}
        errors.array()?.forEach(item => {
            errorMessageObj[item.path] = item.msg
        });

        res.status(422).render("auth/signup", {
            title: "Signup",
            path: "/auth/signup",
            errorMessages: errorMessageObj || {},
            cachedValues: { name, email, password, password2 } = req.body
        })
    } else {
        try {
            const password = await bcrypt.hash(req.body.password, 12)
            const user = new User({
                name: req.body.name, 
                email: req.body.email,
                password,
                cart: {items: [], total: 0.00}
            })
            await user.save()
            req.session.user = user
            req.session.isLoggedIn = true
            req.session.save(() => {
                const msg = {
                    to: req.body.email, // Change to your recipient
                    from: 'daniel@danielstephany.com', // Change to your verified sender
                    subject: 'Signup Successfull',
                    html: '<strong>Your Signup was successfull.</strong>',
                }
                sgMail.send(msg)
                res.redirect("/")
            })
        } catch(e){
            console.log(e)
        }
    }
}

const postLogin = async (req, res, next) => {
    let errors = validationResult(req)

    if (!errors.isEmpty()){
        const errorMessages = {}
        errors.array()?.forEach(item => {
            errorMessages[item.path] = item.msg
        });

        return res.status(422).render("auth/login", {
            title: "Login",
            path: "/auth/login",
            errorMessages: errorMessages || {},
            cachedValues: {email, password} = req.body
        })
    }

    try {
        const user = await User.findOne({email: req.body?.email})
        const isValidPassword = await bcrypt.compare(req.body?.password, user?.password || "")
        if (isValidPassword){
            req.user = user
            req.session.user = user
            req.session.isLoggedIn = true
            req.session.save(() => {
                res.redirect("/")
            })
        } else {
            req.flash('error', 'Invalid email or password.')
            res.redirect("/auth/login")
        }

    } catch(e){
        console.log(e)
    }

}

const logout = async (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/auth/login")
    })
}

const resetPassword = async (req, res, next) => {
    let errorMessage = req.flash('error')
    if (Array.isArray(errorMessage)) errorMessage = errorMessage[0]
    res.render("auth/resetPassword", {
        title: "Reset Password",
        path: "/auth/reset-password",
        errorMessage
    })
}

const postResetPassword = async (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err)
            return res.redirect("/auth/reset-password")
        }
        const token = buffer.toString("hex")
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                req.flash("error", "No user found with that email.")
                res.redirect("/auth/reset-password")
            } else {
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            }
        }).then(result => {
            if (result) {
                res.redirect("/")
                const msg = {
                    to: req.body.email, // Change to your recipient
                    from: 'daniel@danielstephany.com', // Change to your verified sender
                    subject: 'Reset Password',
                    html: `
                        <p>You requested to reset your password.<p>
                        <p>Click this <a href="http://localhost:3000/auth/reset-password/${token}">link</a> to set a new password.<p>
                    `,
                }
                sgMail.send(msg)
            }
        }).catch(e => {
            console.log(err)
        })

    })
}

const updatePassword = async (req, res, next) => {
    const token = req.params.token
    let errorMessage = req.flash('error')
    if (Array.isArray(errorMessage)) errorMessage = errorMessage[0]

    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    if(user){
        res.render("auth/updatePassword", {
            title: "Update Password",
            path: "/auth/reset-password/" + token,
            token: req.params.token,
            errorMessage
        })
    } else {
        req.flash('error', "Reset to token was expired, please try again.")
        res.redirect("/auth/reset-password")
    }

}

const postUpdatePassword = async (req, res, next) => {
    const {password: p1, password2: p2, token} = req.body;
    if(p1.trim() === p2.trim()){
        try {
            const user = await User.findOne({resetToken: req.body.token, resetTokenExpiration: {$gt: Date.now()}})
            if(user){
                const password = await bcrypt.hash(p1, 12)
                user.password = password
                user.resetToken = null
                user.resetTokenExpiration = null
                await user.save()
                return res.redirect("/auth/login")
            }
        } catch (e){
            req.flash("error", "An unexpected error occored, please try again.")
            res.redirect("/auth/reset-password")
        }
    } else {
        req.flash("error", "Passwords did not match")
        res.redirect("/auth/reset-password/" + token)
    }

}

module.exports = {
    createAccount,
    getSignUp,
    getLogin,
    postLogin,
    logout,
    resetPassword,
    postResetPassword,
    updatePassword,
    postUpdatePassword
}