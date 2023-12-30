const fs = require("fs")
const path = require("path")
const rootDir = require("../utils/path")
const Cart = require("./cart")
const filePath = path.join(rootDir, "data", "products.json")
const db = require("../utils/database")


module.exports = class product {
    constructor(title, imgUrl, description, price, id = String(Date.now())){
        this.title = title
        this.imgUrl = imgUrl
        this.description = description
        this.price = parseInt(price, 10)
        this.id = id
    }

    async save() {
        return db.execute(
            `INSERT INTO products (title, price, imgUrl, description)
            VALUES (?, ?, ?, ?)`,
            [this.title, this.price, this.imgUrl, this.description]
        )
    }

    async update() {
        
    }

    static async deleteById(id){
        
    }

    static async fetchAll() {
        return db.execute("SELECT * FROM products")
    }

    static async findById(id) {
        return db.execute("SELECT * FROM products WHERE id = ?", [id])
    }
}