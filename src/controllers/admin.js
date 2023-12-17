const Product = require("../Models/product")

const getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { title: "Add product", path: "/admin/add-product" })
}

const postAddProduct = async (req, res, next) => {

    const product = new Product(
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price,
        )
    await product.save()

    res.redirect("/")
}

const getEditProduct = async (req, res, next) => {
    const productId = req.params.productId
    const product = await Product.findById(productId)
    res.render("admin/edit-product", {title: "Edit Product", path: "/admin/edit-product", product})
}

const deleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    await Product.deleteById(productId)
    res.redirect("/admin/products")
}

const editProduct = async (req, res, next) => {
    const product = new Product(
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price,
        req.body.id
    )
    await product.update();
    res.redirect("/admin/products")
}

const getProducts = async (req, res, next) => {
    const products = await Product.fetchAll()
    res.render("admin/products", { prods: products, title: "Shop", path: "/admin/products"})
}

module.exports = {
    getAddProduct,
    postAddProduct,
    getProducts,
    getEditProduct,
    editProduct,
    deleteProduct
}