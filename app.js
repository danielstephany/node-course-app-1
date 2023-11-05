const express = require("express")

const port = 3001
const app = express();

app.use("/", (req, res, next) => {
    console.log("always called")
    next()
})

app.use("/add-product", (req, res, next) => {
    console.log("middle ware 1")
    res.send(`<h1>The "add product" page</h1>`)
})

app.use("/", (req, res, next) => {
    console.log("home")
    res.send("<h1>Home</h1>")
})

app.listen(port, () => {
    console.log("listening on port: 3000")
})