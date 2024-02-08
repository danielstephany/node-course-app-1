const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true
    }

})

const Product = mongoose.model("Product", productSchema)


// const { getDb } = require("../utils/database")
// const {ObjectId} = require('mongodb')


// class Product {
//     constructor(title, price, description, imgUrl, userId){
//         this.title = title
//         this.price = price
//         this.description = description,
//         this.imgUrl = imgUrl
//         this.userId = userId
//     }

//     async save(){
//         const db = getDb()
//         try {
//             await db.collection('products').insertOne(this)
//         } catch (e) {
//             console.log(e)
//         }
//         return null
//     }

//     static async fetchAll(){
//         const db = getDb()
//         try {
//             const products = db.collection("products").find().toArray();
//             return products
//         } catch(e){
//             console.log(e)
//         }
//         return null
//     }

//     static async fetchById(id){
//         const db = getDb()
//         try {
//             const product = db.collection("products").findOne({ _id: new ObjectId(id) });
//             return product
//         } catch(e){
//             console.log(e)
//         }
//         return null
//     }

//     static async updateOne(id, data){
//         const db = getDb()
//         try {
//             const product = db.collection("products").updateOne(
//                 { _id: new ObjectId(id) },
//                 { $set: data }
//             );
//             return product
//         } catch(e){
//             console.log(e)
//         }
//         return null
//     }

//     static async deleteById(id){
//         const db = getDb()
//         try {
//             const product = db.collection("products").deleteOne(
//                 { _id: new ObjectId(id) }
//             );
//             return product
//         } catch(e){
//             console.log(e)
//         }
//         return null
//     }
// }

module.exports.productSchema = productSchema
module.exports.Product = Product