const express = require("express")
const isAuthenticated = require("../middleware/isAuthenticated")
const {
    check,
    body
} = require("express-validator")

const {
    getAddProduct,
    postAddProduct,
    getEditProduct,
    getProducts,
    editProduct,
    deleteProduct,
} = require("../controllers/admin")

const router = express.Router()

router.get(
    "/add-product", 
    isAuthenticated, 
    [
        body("title").trim().notEmpty(),
        body("price").trim().notEmpty(),
        body("description").trim().notEmpty(),
        body("imgUrl").trim().notEmpty(),
        body("userId").trim().notEmpty()
    ], 
    getAddProduct
)

router.post("/edit-product", isAuthenticated, editProduct)

router.post("/delete-product", isAuthenticated, deleteProduct)

router.get("/edit-product/:productId", isAuthenticated, getEditProduct)

router.get("/products", isAuthenticated, getProducts)

router.post("/product", isAuthenticated, postAddProduct)

module.exports = router