const Product = require("../Models/product")
const Cart = require("../Models/cart")

const getShopProducts = async (req, res, next) => {
    try {
        const [products, fieldData] = await Product.fetchAll()
        res.render("shop/product-list", { prods: products, title: "Shop Products", path: "/products" })
    } catch (e) {
        console.log(e)
    }
}

const getProduct = async (req, res, next) => {
    try {
        const [products, fieldData] = await Product.findById(req.params.productId)
        res.render("shop/product-details", { product: products[0] || null, title: "Product Details", path: "/products" })
    } catch(e){
        console.log(e)
    }
}

const getIndex = async (req, res, next) => {
    try {
        const [products, fieldData] = await Product.fetchAll()
        res.render("shop/index", { prods: products, title: "Shop", path: "/" })
    } catch(e) {
        console.log(e)
    }
}

const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.getCart()
        const [products, fieldData] = await Product.fetchAll()
        let cartWithProducts = {products: [], totalPrice: cart.totalPrice}
    
        for(let product of products){
            const prod = cart.products.find(prod => prod.id === product.id)
            if (prod) cartWithProducts.products.push({ ...product, ...prod })
        }
        
        res.render("shop/cart", { title: "Cart", path: "/cart", cart: cartWithProducts })
    } catch (e) {
        console.log(e)
    }
}

const cartDeleteItem = async (req, res, next) => {
    try {
        const productId = req.body.productId
        const [products, fieldData] = await Product.findById(productId)
        await Cart.deleteById(productId, products[0]?.price)
        res.redirect("/cart")
    } catch (e) {
        console.log(e)
    }
}

const postCart = async (req, res, next) => {
    const productId = req.body.productId
    const [products, fieldData] = await Product.findById(productId)
    Cart.addProduct(productId, products[0].price)
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