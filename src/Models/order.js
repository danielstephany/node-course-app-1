const mongoose = require("mongoose")
const {productSchema} = require("./product")

const orderSchema = new mongoose.Schema({
    items: [{
        product: {type: Object, required: true},
        quantity: { type: Number, required: true }
    }],
    user: {
        userId: { type: mongoose.ObjectId, ref: "User" },
        name: { type: String, }
    }

})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order