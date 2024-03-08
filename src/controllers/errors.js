const get404 = (req, res, next) => {
    res.status(404).render("404", { 
        title: "404", 
        path: "/404"
    })
}

const get500 = (req, res, next) => {
    res.status(500).render("500", { 
        title: "500", 
        path: "/500"
    })
}

module.exports = {
    get404,
    get500
}