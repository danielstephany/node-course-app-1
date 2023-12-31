const Product = require("../Models/product")
const Cart = require("../Models/cart")

const getShopProducts = async (req, res, next) => {
    const products = await Product.fetchAll()
    res.render("shop/product-list", { prods: products, title: "Shop Products", path: "/products" })
}

const getProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.productId)

    res.render("shop/product-details", { product, title: "Product Details", path: "/products" })
}

const getIndex = async (req, res, next) => {
    const products = await Product.fetchAll()
    res.render("shop/index", { prods: products, title: "Shop", path: "/" })
}

const getCart = async (req, res, next) => {
    const cart = await Cart.getCart()
    const products = await Product.fetchAll()
    let cartWithProducts = {products: [], totalPrice: cart.totalPrice}

    for(let product of products){
        const prod = cart.products.find(prod => prod.id === product.id)
        if (prod) cartWithProducts.products.push({ ...product, ...prod })
    }
    
    res.render("shop/cart", { title: "Cart", path: "/cart", cart: cartWithProducts })
}

const cartDeleteItem = async (req, res, next) => {
    const productId = req.body.productId
    const product = await Product.findById(productId)
    await Cart.deleteById(productId, product.price)
    res.redirect("/cart")
}

const postCart = async (req, res, next) => {
    const productId = req.body.productId
    const product = await Product.findById(productId)
    Cart.addProduct(productId, product.price)
    res.redirect("/")
}

const getCheckout = (req, res, next) => {
    res.render("shop/checkout", { title: "Checkout", path: "/checkout" })
}

const getOrders = (req, res, next) => {
    res.render("shop/orders", { title: "Orders", path: "/orders" })
}

module.exports = {
    getShopProducts, 
    getProduct,
    getIndex,
    getCart,
    postCart,
    getCheckout,
    getOrders,
    cartDeleteItem
}