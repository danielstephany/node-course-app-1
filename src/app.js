const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const rootDir = require("./utils/path")
const {get404} = require("./controllers/errors")

const {adminRoutes} = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const port = 3000
const app = express();

app.set('view engine', 'ejs');
app.set("views", path.join(rootDir,"views"))

app.use(express.static(path.join(rootDir, "public")))

app.use(bodyParser.urlencoded({ extended: false }))

app.use("/admin", adminRoutes)

app.use(shopRoutes)

app.use(get404)

app.listen(port, () => {
    console.log("listening on port: 3000")
})