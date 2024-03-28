const {Product} = require("../Models/product")
const Order = require("../Models/order")
const PDFDocument = require('pdfkit');
const fs = require("fs")
const path = require("path")
const { deleteFile } = require("../utils/file")

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
        const cart = await req.user.getCart()
        cart.total = parseFloat(cart.total).toFixed(2)

        res.render("shop/cart", { 
            title: "Cart", 
            path: "/cart", 
            cart
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

const getInvoice = async (req, res, next) => {
    const orderId = req.params.orderId

    try {
        const order = await Order.findById(orderId)
        if(!order){
            return next(new Error("No order found"))
        } else if (order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error("Unauthorized"))
        } else {
            const invoiceName = "invoice-" + orderId + ".pdf"
            const invoicePath = path.join("src", "data", "invoices", invoiceName)
    
            
            const pdfDoc = new PDFDocument()
            pdfDoc.pipe(fs.createWriteStream(invoicePath))
    
            res.setHeader('Content-disposition', 'inline; filename="' + invoiceName + '"');
            res.setHeader('Content-type', 'application/pdf');
            pdfDoc.pipe(res)
    
            pdfDoc.fontSize(24)
            pdfDoc.text(`Order: ${orderId || "-"}`)
            pdfDoc.text(`Purchaser: ${order?.user?.name || "-"}`)
            pdfDoc.text("–––––––––––––––––––––––––––––––––––", {
                lineGap: 10
            })
            pdfDoc.fontSize(20)
            pdfDoc.text("items:", {
                lineGap: 10
            })
            pdfDoc.fontSize(16)
            order?.items.forEach(item => {
                pdfDoc.text(`(QTY: ${item?.quantity || "-"} Price: $${item?.product?.price || "-"}) -- ${item?.product?.title || "-"}`,
                {
                    lineGap: 10
                })
            })
    
            pdfDoc.fontSize(20)
            pdfDoc.text(`Total: ${order?.total || "-"}`)
    
            pdfDoc.end()
            setTimeout(() => {
                deleteFile(invoicePath)
            }, 0)
        }
    } catch(e){
        return next(e)
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
    createOrder,
    getInvoice
}