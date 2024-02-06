const express = require("express")
const {
    getAddProduct,
    postAddProduct,
    getEditProduct,
    getProducts,
    editProduct,
    deleteProduct,
} = require("../controllers/admin")

const router = express.Router()

router.get("/add-product", getAddProduct)

router.post("/edit-product", editProduct)

router.post("/delete-product", deleteProduct)

router.get("/edit-product/:productId", getEditProduct)

router.get("/products", getProducts)

router.post("/product", postAddProduct)

module.exports = router