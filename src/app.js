const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const rootDir = require("./utils/path")
const {get404} = require("./controllers/errors")
const mongoose = require("mongoose")
const {mongoConnect} = require("./utils/database")
const User = require("./Models/user")

const adminRoutes = require("./routes/admin")
const authRoutes = require("./routes/auth")
const shopRoutes = require("./routes/shop")

const port = 3000
const app = express();

app.set('view engine', 'ejs');
app.set("views", path.join(rootDir,"views"))

app.use(express.static(path.join(rootDir, "public")))

app.use(bodyParser.urlencoded({ extended: false }))

// app.use((req, res, next) => {
//     User.findByEmail("danielstephany85@gmail.com")
//     .then(user => {
//         if(user){
//             req.user = new User(user.name, user.email, user.cart, user._id)
//         }
//         next()
//     }).catch(e => console.log(e))
// });

app.use("/admin", adminRoutes)
app.use("/auth", authRoutes)

app.use(shopRoutes)

app.use(get404)

mongoose.connect("mongodb+srv://danielstephany85:XY3PvJccZv6mKVAg@cluster0.wcc9b8m.mongodb.net/shop?retryWrites=true&w=majority")
.then(() => {
    app.listen(port, () => {
        console.log("listening on port: 3000")
    })
})
.catch(e => {
    console.log(e)
})
