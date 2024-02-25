const {Product} = require("../Models/product")

const getShopProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.render("shop/product-list", { 
            prods: products, 
            title: "Shop Products", 
            path: "/products"
        })
    } catch (e) {
        console.log(e)
    }
}

const getProduct = async (req, res, next) => {
    try {
        let productId = req.params.productId
        const product = await Product.findById(productId)
        console.log(product)
        res.render("shop/product-details", { 
            product, 
            title: "Product Details", 
            path: "/products"
        })
    } catch(e){
        console.log(e)
    }
}

const getIndex = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.render("shop/index", { 
            prods: products, 
            title: "Shop", 
            path: "/"
        })
    } catch(e) {
        console.log(e)
    }
}

const getCart = async (req, res, next) => {
    try {
        const cartItems = await req.user.getCart()

        res.render("shop/cart", { 
            title: "Cart", 
            path: "/cart", 
            cart: { products: cartItems }
        })
    } catch (e) {
        console.log(e)
    }
}

const cartDeleteItem = async (req, res, next) => {
    try {
        const productId = req.body.productId
        await req.user.deleteCartItem(productId)

        res.redirect("/cart")
    } catch (e) {
        console.log(e)
    }
}

const postCart = async (req, res, next) => {
    const productId = req.body.productId
    
    try {
        const product = await Product.findById(productId)
        await req.user.addToCart(product)

        res.redirect("/cart")
    } catch(e) {
        console.log(e)
    }
}

const getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders()

        res.render("shop/orders", { 
            title: "Orders", 
            path: "/orders", 
            orders
        })

    } catch(e){
        console.log(e)
    }
}

const createOrder = async (req, res, next) => {
    try {
        await req.user.addOrder()

        res.redirect("/orders")
    } catch(e){
        console.log(e)
    }
}

module.exports = {
    getShopProducts, 
    getProduct,
    getIndex,
    getCart,
    postCart,
    getOrders,
    cartDeleteItem,
    createOrder
}