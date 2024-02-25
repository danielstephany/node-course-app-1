const dotenv = require('dotenv')
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const rootDir = require("./utils/path")
const session = require('express-session')
const {get404} = require("./controllers/errors")
const mongoose = require("mongoose")
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require("csurf")
const flash = require("connect-flash")
const User = require("./Models/user")

dotenv.config()

const adminRoutes = require("./routes/admin")
const authRoutes = require("./routes/auth")
const shopRoutes = require("./routes/shop")

const mongodbUri = "mongodb+srv://danielstephany85:XY3PvJccZv6mKVAg@cluster0.wcc9b8m.mongodb.net/shop?retryWrites=true&w=majority"
const port = 3000
const app = express();
const store = new MongoDBStore({
    uri: mongodbUri,
    collection: "sessions"
})
const csrfProtection = csurf();

app.set('view engine', 'ejs');
app.set("views", path.join(rootDir,"views"))

app.use(express.static(path.join(rootDir, "public")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: "temp secret", 
    resave: false, 
    saveUninitialized: false, 
    store
}))
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    if (req.session.isLoggedIn && req.session.user){
        User.findById(req.session.user._id)
        .then(user => {
            if(user){
                req.user = user
            }
            next()
        }).catch(e => {
            console.log(e)
            next()
        })
    } else {
        next()
    }
});

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn,
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use("/admin", adminRoutes)
app.use("/auth", authRoutes)

app.use(shopRoutes)

app.use(get404)

mongoose.connect(mongodbUri)
.then(() => {
    app.listen(port, () => {
        console.log("listening on port: 3000")
    })
})
.catch(e => {
    console.log(e)
})
