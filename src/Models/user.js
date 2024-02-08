const mongoose = require("mongoose")
const Order = require("./order")


const CartSchema = new mongoose.Schema({
    items: {
        type: [{productId: {type: String, ref: "Product", required: true}, quantity: {type: Number, required: true}}],
        required: true
    }
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        type: CartSchema,
        required: true
    }
})

UserSchema.methods.addToCart = async function (product) {
    try {
        let updatedCart;
        const cartProduct = this?.cart?.items?.findIndex(cp => {
            return String(cp.productId) == String(product._id)
        })

        if (cartProduct >= 0) {
            updatedCart = { items: [...this.cart.items] }
            updatedCart.items[cartProduct].quantity++
        } else {
            updatedCart = { items: [{ productId: product._id, quantity: 1 }, ...this.cart.items] }
        }

        this.cart = updatedCart

        return this.save()
    } catch (e) {
        console.log(e)
    }
    return null
}

UserSchema.methods.getCart = async function(){
    try {
        const userWithPopulatedCart = await this.populate("cart.items.productId")
        console.log(userWithPopulatedCart.cart.items)
        return userWithPopulatedCart.cart.items
    } catch (e) {
        console.log(e)
    }
    return null
}

UserSchema.methods.deleteCartItem = async function(productId) {
    try {
        const updatedCart = {
            ...this.cart,
            items: this?.cart?.items?.filter(item => String(item.productId) !== String(productId))
        }

        this.cart = updatedCart

        return this.save()
    } catch (e) {
        console.log(e)
    }
    return null
}

UserSchema.methods.addOrder = async function(){
    try {
        const userWithPopulatedCart = await this.populate("cart.items.productId")
        const items = userWithPopulatedCart.cart.items.map(item => ({product: {...item.productId._doc}, quantity: item.quantity}))
        const order = new Order({
            user: {
                userId: this._id,
                name: this.name
            },
            items
        })

        this.cart = { items: [] }
        await this.save()
        return order.save()
    } catch (e) {
        console.log(e)
    }
    return null
}

UserSchema.methods.getOrders = async function(){
    try {
        const orders = await Order.find({ "user.userId": this._id })
        console.log(orders)
        return orders
    } catch (e) {
        console.log(e)
    }
    return null
}

const User = mongoose.model("User", UserSchema)



    // async addOrder(){
    //     const db = getDb()
    //     try {
    //         const products = await this.getCart()
    //         const order = await db.collection("orders").insertOne({ 
    //             user: { 
    //                 _id: this._id,
    //                 name: this.name
    //             }, 
    //             items: products 
    //         })

    //         this.cart = {items: []}
    //         await db.collection("users").updateOne(
    //             {_id: this._id},
    //             {$set: {cart: this.cart}}
    //         )
    //         return order
    //     } catch(e){
    //         console.log(e)
    //     }
    //     return null
    // }

    // async getOrders(){
    //     const db = getDb()
    //     try {            
    //         const orders = await db.collection("orders").find({"user._id": this._id}).toArray()
    //         console.log(orders)
    //         return orders
    //     } catch(e){
    //         console.log(e)
    //     }
    //     return null
    // }
// }

module.exports = User