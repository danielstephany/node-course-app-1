const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const rootDir = require("./utils/path")
const {get404} = require("./controllers/errors")
const sequelize = require("./utils/database")
const Product = require("./Models/product")
const User = require("./Models/user")
const Cart = require("./Models/cart")
const CartItem = require("./Models/cartItem")
const Order = require("./Models/order")
const OrderItem = require("./Models/orderItem")

const {adminRoutes} = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const port = 3000
const app = express();

app.set('view engine', 'ejs');
app.set("views", path.join(rootDir,"views"))

app.use(express.static(path.join(rootDir, "public")))

app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user
        next()
    }).catch(e => console.log(e))
});

app.use("/admin", adminRoutes)

app.use(shopRoutes)

app.use(get404)

Product.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
})
Product.belongsToMany(Cart, { through: CartItem })
Product.belongsToMany(Order, { through: OrderItem })

Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})

User.hasOne(Cart)
User.hasMany(Product)
User.hasMany(Order)

Order.belongsTo(User)
Order.belongsToMany(Product, {through: OrderItem})

// sequelize.sync({force: true})
sequelize.sync()
.then(res => {
    return User.findByPk(1)
})
.then(user => {
    if(!user){
        return User.create({name: "Daniel", email: "danielstephany85@gmail.com"})
    }
    return user
})
.then(user => {
    return user.createCart()
})
.then(user => {
    // console.log(user)
    app.listen(port, () => {
        console.log("listening on port: 3000")
    })
})
.catch(err => {
    console.log(err)
})
