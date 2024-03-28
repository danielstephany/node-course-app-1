const mongoose = require("mongoose")
const Order = require("./order")
const { Product } = require("./product")


const CartSchema = new mongoose.Schema({
    items: {
        type: [{productId: {type: String, ref: "Product", required: true}, quantity: {type: Number, required: true}}],
        required: true
    },
    total: Number
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
    resetToken: String,
    resetTokenExpiration: Date,
    password: {
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
            updatedCart = { items: [...this.cart.items], total: parseFloat(this.cart.total.toString()) }
            updatedCart.items[cartProduct].quantity++
            updatedCart.total = updatedCart.total + product.price
        } else {
            updatedCart = { 
                items: [{ productId: product._id, quantity: 1 }, ...this.cart.items],
                total: parseFloat(this?.cart?.total?.toString()) + product.price
            }
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
        return userWithPopulatedCart.cart
    } catch (e) {
        console.log(e)
    }
    return null
}

UserSchema.methods.deleteCartItem = async function(productId) {
    try {
        const deletedItem = await Product.findById(productId)
        let quantity = 0
        const updatedCart = {
            ...this.cart,
            items: this?.cart?.items?.filter(item => {
                const isProduct = String(item.productId) === String(productId)
                if(isProduct) quantity = item.quantity
                return !isProduct
            }),
            total: (this?.cart?.total - (deletedItem?.price * quantity) >= 0) ? this?.cart?.total - (deletedItem?.price * quantity) : 0.00
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
        const total = userWithPopulatedCart?.cart?.total.toString() 
        const order = new Order({
            user: {
                userId: this._id,
                name: this.name
            },
            items,
            total
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
        return orders
    } catch (e) {
        console.log(e)
    }
    return null
}

const User = mongoose.model("User", UserSchema)

module.exports = User