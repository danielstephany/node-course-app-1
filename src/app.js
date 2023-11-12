const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const rootDir = require("./utils/path")
const {engine} = require('express-handlebars')

const {adminRoutes, products} = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const port = 3000
const app = express();

app.engine('hbs', engine({
    layoutsDir: path.join(rootDir, "views/layouts"),
    defaultLayout: "main-layout",
    extname: "hbs"
}));
app.set('view engine', 'hbs');
app.set("views", path.join(rootDir,"views"))

app.use(express.static(path.join(rootDir, "public")))

app.use(bodyParser.urlencoded({ extended: false }))

app.use("/admin", adminRoutes)

app.use(shopRoutes)

app.use((req, res, next) => {
    res.status(404).render("404", { title: "404"})
})

app.listen(port, () => {
    console.log("listening on port: 3000")
})