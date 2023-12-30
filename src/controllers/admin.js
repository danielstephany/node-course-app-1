const Product = require("../Models/product")

const getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { title: "Add product", path: "/admin/add-product" })
}

const postAddProduct = async (req, res, next) => {
    try {
        const product = new Product(
            req.body.title,
            req.body.imgUrl,
            req.body.description,
            req.body.price,
            )
        await product.save()
    
        res.redirect("/")
    } catch(e){
        console.log(e)
    }
}

const getEditProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId
        const [products, fieldData] = await Product.findById(productId)
        
        res.render("admin/edit-product", { title: "Edit Product", path: "/admin/edit-product", product: products[0] || null})
    } catch (e){
        console.log(e)
    }
}

const deleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    await Product.deleteById(productId)
    res.redirect("/admin/products")
}

const editProduct = async (req, res, next) => {
    const product = new Product(
        req.body.title,
        req.body.imgUrl,
        req.body.description,
        req.body.price,
        req.body.id
    )
    await product.update();
    res.redirect("/admin/products")
}

const getProducts = async (req, res, next) => {
    try {
        const [products, fieldData] = await Product.fetchAll()
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