const http = require("http")
const handleRoutes = require("./routes")

const server = http.createServer(handleRoutes)

console.log("listening on port: 3000")
server.listen(3000)