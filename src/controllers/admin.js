const Product = require("../Models/product")

const getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { title: "Add product", path: "/admin/add-product" })
}

const postAddProduct = async (req, res, next) => {
    try {
        const product = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            imgUrl: req.body.imgUrl,
            // _id: req.user._id
        })

        await product.save()
    
        res.redirect("/")
    } catch(e){
        console.log(e)
    }
}

const getEditProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)
        
        res.render("admin/edit-product", { title: "Edit Product", path: "/admin/edit-product", product})
    } catch (e){
        console.log(e)
    }
}

const deleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        await Product.deleteOne({_id: productId})
        res.redirect("/admin/products")
    } catch(e){
        console.log(e)
    }
}

const editProduct = async (req, res, next) => {
    try {
        await Product.updateOne({_id: req.body._id}, {
            title: req.body.title,
            imgUrl: req.body.imgUrl,
            description: req.body.description,
            price: req.body.price
        });
        res.redirect("/admin/products")
    } catch(e){
        console.log(e)
    }
}

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.render("admin/products", { prods: products, title: "Shop", path: "/admin/products"})
    } catch(e){
        console.log(e)
    }
}

module.exports = {
    getAddProduct,
    postAddProduct,
    getProducts,
    getEditProduct,
    editProduct,
    deleteProduct
}