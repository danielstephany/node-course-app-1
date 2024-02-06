const express = require("express")
const { 
    getShopProducts,
    getIndex,
    getCart,
    postCart,
    getCheckout,
    getOrders,
    getProduct,
    cartDeleteItem
 } = require("../controllers/shop")

const router = express.Router()

router.get("/", getIndex)

router.get("/products", getShopProducts)

router.get("/products/:productId", getProduct)

router.get("/cart", getCart)

router.post("/cart-delete-item", cartDeleteItem)

router.post("/cart", postCart)

router.get("/checkout", getCheckout)

router.get("/orders", getOrders)

module.exports = router