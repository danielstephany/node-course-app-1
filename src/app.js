const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const rootDir = require("./utils/path")

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const port = 3000
const app = express();

app.use(express.static(path.join(rootDir, "public")))

app.use(bodyParser.urlencoded({ extended: false }))

app.use("/admin", adminRoutes)

app.use(shopRoutes)

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "views/404.html"))
})

app.listen(port, () => {
    console.log("listening on port: 3000")
})