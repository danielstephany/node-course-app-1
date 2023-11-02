const fs = require('fs')

const handleRoutes = (req, res) => {
    const {url, method} = req

    if (url === "/"){
        res.setHeader('Content-Type', "text/html")
        res.write(`
            <html>
                <head>
                    <title>Welcome</title>
                </head>
                <body>
                    <h1>Enter User</h1>
                    <form action="/addUser" method="POST">
                        <label>
                            Name
                            <input name="name" />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                    <div style="marginTop: 20px;">
                        <a href="/users">View Users</a>
                    <div>
                </body>
            <html>
        `)
        return res.end()
    }
    if (url === "/users"){
        fs.readFile("./users.json", "utf8", (err, data) => {
            let users = []
            let userHtml = "<li>No users found</li>"
            if (!err && data) {
                users = JSON.parse(data)
                userHtml = ""
                users.forEach(user => {
                    userHtml += `<li>${user}</li>`
                })
            }
            res.setHeader('Content-Type', "text/html")
            res.write(`
                <html>
                    <head>
                        <title>Users</title>
                    </head>
                    <body>
                        <h1>Users</h1>
                        <ul>
            `)    
            res.write(userHtml)
            res.write(`
                        </ul>
                        <div style="marginTop: 20px;">
                            <a href="/">Add User</a>
                        <div>
                    </body>
                <html>
            `)    
            return res.end()
        })
    }
    if (url === "/addUser" && method === "POST"){
        const body = []

        req.on("data", chunk => {
            body.push(chunk)
        })

        req.on("end", () => {            
            const json = {}
            const parsedBody = Buffer.concat(body).toString()
            parsedBody.split("&").forEach(item => {
                item = item.split("=")
                json[item[0]] = item[1]
            })
            
            let fileBodyJson = []

            fs.readFile("./users.json", "utf8", (err, data) => {
                if (!err && data) {
                    fileBodyJson = JSON.parse(data)
                }

                fileBodyJson.push(json.name)

                fs.writeFile("users.json", JSON.stringify(fileBodyJson), err => {
                    if (err) console.log(err)
                })

                res.statusCode = 302
                res.setHeader("Location", "/")
                return res.end()
            })

            
        })

    }
}

module.exports = handleRoutes