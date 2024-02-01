const Product = require("../Models/product")

const getShopProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll()
        res.render("shop/product-list", { prods: products, title: "Shop Products", path: "/products" })
    } catch (e) {
        console.log(e)
    }
}

const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(productId)
        res.render("shop/product-details", { product, title: "Product Details", path: "/products" })
    } catch(e){
        console.log(e)
    }
}

const getIndex = async (req, res, next) => {
    try {
        const products = await Product.findAll()
        res.render("shop/index", { prods: products, title: "Shop", path: "/" })
    } catch(e) {
        console.log(e)
    }
}

const getCart = async (req, res, next) => {
    try {
        const cart = await req.user.getCart()
        const products = await cart.getProducts()

        res.render("shop/cart", { title: "Cart", path: "/cart", cart: {products} })
    } catch (e) {
        console.log(e)
    }
}

const cartDeleteItem = async (req, res, next) => {
    try {
        const productId = req.body.productId
        const cart = await req.user.getCart()
        const products = await cart.getProducts({where: {id: productId}})
        cart.removeProduct(products[0])
        res.redirect("/cart")
    } catch (e) {
        console.log(e)
    }
}

const postCart = async (req, res, next) => {
    const productId = req.body.productId
    
    try {
        const cart = await req.user.getCart()
        const products = await cart.getProducts({where: {id: productId}})
        let cartProduct;

        if(products.length){
            cartProduct = products[0]
        }

        let newQuantity = 1; 

        if (cartProduct){
            newQuantity = cartProduct.cartItem.quantity + 1
            await cart.addProduct(cartProduct, { through: { quantity: newQuantity } })
        } else {
            const product = await Product.findByPk(productId)
            await cart.addProduct(product, { through: { quantity: newQuantity}})
        }

        res.redirect("/")
    } catch(e) {
        console.log(e)
    }
}

const getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders({include: ["products"]})
        console.log(orders)

        res.render("shop/orders", { title: "Orders", path: "/orders", orders })

    } catch(e){
        console.log(e)
    }
}

const createOrder = async (req, res, next) => {
    try {
        const cart = await req.user.getCart()
        const products = await cart.getProducts()
        const order = await req.user.createOrder()
        order.addProducts(products.map(product => {
            product.orderItem = {quantity: product.cartItem.quantity}
            return product
        }))
        await cart.setProducts(null)

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