const express = require("express")
const isAuthenticated = require("../middleware/isAuthenticated")

const { 
    getShopProducts,
    getIndex,
    getCart,
    postCart,
    getOrders,
    getProduct,
    cartDeleteItem,
    createOrder
 } = require("../controllers/shop")

const router = express.Router()

router.get("/", getIndex)

router.get("/products", getShopProducts)

router.get("/products/:productId", getProduct)

router.get("/cart", isAuthenticated, getCart)

router.post("/cart-delete-item", isAuthenticated, cartDeleteItem)

router.post("/cart", isAuthenticated, postCart)

router.post("/create-order", isAuthenticated, createOrder)

router.get("/orders", isAuthenticated, getOrders)

module.exports = router