const Product = require("../Models/product")

const getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { title: "Add product", path: "/admin/add-product" })
}

const postAddProduct = async (req, res, next) => {
    try {
        //the createProduct method gets created when the user is assoiated with the product 
        //using the belongsTo or HasMany methods
        //this method will automaticly provide the user id to the new product
        await req.user.createProduct({
            title: req.body.title,
            imgUrl: req.body.imgUrl,
            description: req.body.description,
            price: req.body.price
        })
    
        res.redirect("/")
    } catch(e){
        console.log(e)
    }
}

const getEditProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId
        const [product] = await req.user.getProducts({where: {id: productId}})
        console.log(product)
        
        res.render("admin/edit-product", { title: "Edit Product", path: "/admin/edit-product", product})
    } catch (e){
        console.log(e)
    }
}

const deleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        await Product.destroy({
            where: {
                id: productId
            }
        })
        res.redirect("/admin/products")
    } catch(e){
        console.log(e)
    }
}

const editProduct = async (req, res, next) => {
    try {
        await Product.update({
            title: req.body.title,
            imgUrl: req.body.imgUrl,
            description: req.body.description,
            price: req.body.price
        }, {
            where: {
                id: req.body.id
            }
        });
        res.redirect("/admin/products")
    } catch(e){
        console.log(e)
    }
}

const getProducts = async (req, res, next) => {
    try {
        const products = await req.user.getProducts()
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