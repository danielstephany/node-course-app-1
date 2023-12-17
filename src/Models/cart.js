const fs = require("fs")
const path = require("path")
const rootDir = require("../utils/path")

const filePath = path.join(rootDir, "data", "cart.json")

const getCartData = async () => {
    try {
        let json
        const fileString = await fs.promises.readFile(filePath, { encoding: 'utf8' })
        if (fileString) json = JSON.parse(fileString)

        return json
    } catch (e) {
        return {products: [], totalPrice: 0}
    }
}

class Cart {
    static async addProduct(id, price){
        let cart = {}
        const cartJson = await getCartData()
        const existingProductIndex = cartJson?.products?.findIndex((item) => item.id === id)

        if (existingProductIndex >= 0){
            cart.products = [...cartJson.products]
            cart.products[existingProductIndex].qty++
        } else {
            cart.products = [...cartJson.products, {id, qty:1}]
        }
    
        if (typeof cartJson.totalPrice === "number"){
            cart.totalPrice = cartJson.totalPrice + Number(price.toFixed(2))
        } else {
            cart.totalPrice = price.toFixed(2)
        }

        try {
            await fs.promises.writeFile(filePath, JSON.stringify(cart));
        } catch (e) {
            console.log(e)
        }
    }

    static async deleteById(id, price) {
        const cartJson = await getCartData()
        const index = cartJson.products.findIndex(item => item.id === id)
        if(index >= 0){
            const itemQty = cartJson.products[index].qty 
            const updatedCart = { 
                products: [...cartJson.products], 
                totalPrice: cartJson.totalPrice - (price * itemQty).toFixed(2)
            }
            updatedCart.products.splice(index, 1)
            try {
                await fs.promises.writeFile(filePath, JSON.stringify(updatedCart));
            } catch (e) {
                console.log(e)
            }
        }
    }

    static async getCart(){
        const cartJson = await getCartData()
        return cartJson
    }
}

module.exports = Cart