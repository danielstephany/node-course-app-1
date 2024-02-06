const fs = require("fs")
const path = require("path")
const rootDir = require("../utils/path")
const Cart = require("./cart")
const filePath = path.join(rootDir, "data", "products.json")

const getProductsFromFile = async () => {
    try {
        let json
        const fileString = await fs.promises.readFile(filePath, { encoding: 'utf8' })
        if (fileString) json = JSON.parse(fileString)

        return json
    } catch (e) {
        return []
    }
}

module.exports = class product {
    constructor(title, imageUrl, description, price, id = String(Date.now())){
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = parseInt(price, 10)
        this.id = id
    }

    async save() {
        const products = await getProductsFromFile()

        try {
            products.push(this)
            await fs.promises.writeFile(filePath, JSON.stringify(products));
        } catch(e){
            console.log(e)
        }
        return null
    }

    async update() {
        let updatedProducts
        const products = await getProductsFromFile()
        const index = products.findIndex(prod => prod.id === this.id)
        try {
            updatedProducts = [...products]
            updatedProducts[index] = this
            await fs.promises.writeFile(filePath, JSON.stringify(updatedProducts));
        } catch(e){
            console.log(e)
        }
        return null
    }

    static async deleteById(id){
        const products = await getProductsFromFile()
        const product = products?.filter(prod => prod.id === id)[0]
        const updatedProducts = products?.filter(prod => prod.id !== id)
        try {
            await fs.promises.writeFile(filePath, JSON.stringify(updatedProducts));
            await Cart.deleteById(id, product.price)
        } catch(e){
            console.log(e)
        }
        return null
    }

    static async fetchAll() {
        const products = await getProductsFromFile()
        return products
    }

    static async findById(id) {
        const products = await getProductsFromFile()
        const product = products.filter(prod => prod.id === id)[0]
        return product
    }
}