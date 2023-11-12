const express = require("express")
const path = require("path")
const rootDir = require("../utils/path")

const router = express.Router()

const products = []

router.get("/add-product", (req, res, next) => {
    res.render("add-product", {title: "Add product", path: "/admin/add-product", isAddProduct: true})
})

router.post("/product", (req, res, next) => {
    console.log(req.body)
    products.push({
        title: req.body.title
    })
    res.redirect("/")
})


module.exports.products = products
module.exports.adminRoutes = router