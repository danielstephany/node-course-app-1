const express = require("express")
const isAuthenticated = require("../middleware/isAuthenticated")

const {
    getAddProduct,
    postAddProduct,
    getEditProduct,
    getProducts,
    editProduct,
    deleteProduct,
} = require("../controllers/admin")

const router = express.Router()

router.get("/add-product", isAuthenticated, getAddProduct)

router.post("/edit-product", isAuthenticated, editProduct)

router.post("/delete-product", isAuthenticated, deleteProduct)

router.get("/edit-product/:productId", isAuthenticated, getEditProduct)

router.get("/products", isAuthenticated, getProducts)

router.post("/product", isAuthenticated, postAddProduct)

module.exports = router