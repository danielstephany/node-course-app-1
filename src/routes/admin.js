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

router.get("/add-product", isAuthenticated,  getAddProduct)

router.post(
    "/edit-product", 
    isAuthenticated, 
    [
        body("title", "required").trim().notEmpty(),
        body("price", "required").trim().notEmpty(),
        body("description", "required").trim().notEmpty(),
        body("imgUrl", "required").trim().notEmpty(),
        body("_id", "required").trim().notEmpty()
    ],
    editProduct
)

router.post("/delete-product", isAuthenticated, deleteProduct)

router.get("/edit-product/:productId", isAuthenticated, getEditProduct)

router.get("/products", isAuthenticated, getProducts)

router.post(
    "/product", 
    isAuthenticated, 
    [
        body("title", "required").trim().notEmpty(),
        body("price", "required").trim().notEmpty(),
        body("description", "required").trim().notEmpty(),
        body("imgUrl", "required").trim().notEmpty(),
        body("userId", "required").trim().notEmpty()
    ],
    postAddProduct
)

module.exports = router