const { findById } = require("../Models/order")
const {Product} = require("../Models/product")

const getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { 
        title: "Add product", 
        path: "/admin/add-product"
    })
}

const postAddProduct = async (req, res, next) => {
    try {
        const product = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            imgUrl: req.body.imgUrl,
            userId: req.user._id
        })

        await product.save()
    
        res.redirect("/")
    } catch(e){
        console.log(e)
    }
}

const getEditProduct = async (req, res, next) => {
    let errorMessage = req.flash('error')
    if (Array.isArray(errorMessage)) errorMessage = errorMessage[0]

    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)
        
        res.render("admin/edit-product", { 
            title: "Edit Product", 
            path: "/admin/edit-product", 
            product,
            errorMessage
        })
    } catch (e){
        console.log(e)
    }
}

const deleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        const product = await Product.findById(productId)
        if (product?.userId && String(product?.userId) === String(req.user._id)) {
            await Product.deleteOne({_id: productId, userId: req.user._id})
            res.redirect("/admin/products")
        } else {
            req.flash("error", "You do not have access to delete this product.")
            res.redirect(`/admin/products`)
        }
    } catch(e){
        console.log(e)
    }
}

const editProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.id)
        if(product?.userId === req.user._id){
            await Product.updateOne({_id: req.body._id}, {
                title: req.body.title,
                imgUrl: req.body.imgUrl,
                description: req.body.description,
                price: req.body.price
            });
            res.redirect("/admin/products")
        } else {
            req.flash("error", "You do not have access to edit this product.")
            res.redirect(`/admin/edit-product/${req.body._id}`)
        }
    } catch(e){
        console.log(e)
    }
}

const getProducts = async (req, res, next) => {
    let errorMessage = req.flash('error')
    if (Array.isArray(errorMessage)) errorMessage = errorMessage[0]

    try {
        const products = await Product.find({userId: req.user._id})

        res.render("admin/products", { 
            prods: products, 
            title: "Shop", 
            path: "/admin/products",
            errorMessage
        })
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