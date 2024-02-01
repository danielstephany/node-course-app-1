const express = require("express")
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

router.get("/cart", getCart)

router.post("/cart-delete-item", cartDeleteItem)

router.post("/cart", postCart)

router.post("/create-order", createOrder)

router.get("/orders", getOrders)

module.exports = router