module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn){
        res.redirect("/auth/login")
    } else {
        next()
    }
}