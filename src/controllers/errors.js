const get404 = (req, res, next) => {
    res.status(404).render("404", { title: "404", path: "/404" })
}

module.exports = {
    get404
}