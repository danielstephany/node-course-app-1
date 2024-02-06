const {ObjectId} = require("mongodb")
const {getDb} = require("../utils/database")

class User {
    constructor(name, email, cart, id){
        this.name = name
        this.email = email
        this.cart = cart || {items: []}
        this._id = id ? new ObjectId(id) : undefined
    }

    async save(){
        const db = getDb()
        try {
            const user = await User.findByEmail(this.email)
            if(!user){
                await db.collection("users").insertOne(this)
            } else {
                throw "User currently exists for given email."
            }
        } catch(e) {
            console.log(e)
        }
        return null
    }

    static async findById(id){
        const db = getDb()
        try {
            const user = await db.collection("users").findOne({ _id: new ObjectId(id)})
            return user
        } catch (e) {
            console.log(e)
        }
        return null
    }

    static async findByEmail(email){
        const db = getDb()
        try {
            const user = await db.collection("users").findOne({ email })
            return user
        } catch (e) {
            console.log(e)
        }
        return null
    }

    async addToCart(product){
        const db = getDb()

        try {
            let updatedCart;
            const cartProduct = this?.cart?.items?.findIndex(cp => {
                return String(cp.productId) == String(product._id)
            })

            if (cartProduct >= 0){
                updatedCart = { items: [...this.cart.items] }
                updatedCart.items[cartProduct].quantity++
            } else {                
                updatedCart = { items: [{ productId: new ObjectId(product._id), quantity: 1 }, ...this.cart.items] }
            }
            
            this.cart = updatedCart
            const updatedUser = await db.collection("users").updateOne(
                { _id: this._id},
                {$set: {cart: updatedCart}}
            )
            console.log(updatedUser)
            return updatedUser
        } catch(e){
            console.log(e)
        }
        return null
    }

    async getCart(){
        const db = getDb()
        try {
            const productIds = this?.cart?.items?.map(item => item.productId)
            const products = await db.collection("products").find({_id: {$in: productIds}}).toArray()
    
            return products.map((product) => (
                {
                    ...product,
                    quantity: this?.cart?.items?.find(item => String(item.productId) === String(product._id))?.quantity               
                }
            ))
        } catch(e){
            console.log(e)
        }
    }

    async deleteCartItem(productId) {
        const db = getDb()
        try {
            const updatedCart = {
                ...this.cart,
                items: this?.cart?.items?.filter(item => String(item.productId) !== String(productId))
            }

            const updatedUser = await db.collection("users").updateOne(
                { _id: this._id },
                {$set: {cart: updatedCart}}
            )

            return updatedUser
        } catch (e) {
            console.log(e)
        }
        return null
    }

    async addOrder(){
        const db = getDb()
        try {
            const products = await this.getCart()
            const order = await db.collection("orders").insertOne({ 
                user: { 
                    _id: this._id,
                    name: this.name
                }, 
                items: products 
            })

            this.cart = {items: []}
            await db.collection("users").updateOne(
                {_id: this._id},
                {$set: {cart: this.cart}}
            )
            return order
        } catch(e){
            console.log(e)
        }
        return null
    }

    async getOrders(){
        const db = getDb()
        try {            
            const orders = await db.collection("orders").find({"user._id": this._id}).toArray()
            console.log(orders)
            return orders
        } catch(e){
            console.log(e)
        }
        return null
    }
}

module.exports = User