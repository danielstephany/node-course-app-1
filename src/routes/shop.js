const express = require("express")
const path = require("path")
const rootDir = require("../utils/path")
const {products} = require("./admin")

const router = express.Router()

router.get("/", (req, res, next) => {
    console.log("shop.js", products)
    res.render("shop", {prods: products})
})

module.exports = router