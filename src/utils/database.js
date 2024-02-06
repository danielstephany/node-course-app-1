const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
    MongoClient.connect("mongodb+srv://danielstephany85:XY3PvJccZv6mKVAg@cluster0.wcc9b8m.mongodb.net/shop?retryWrites=true&w=majority")
    .then(res => {
        console.log("Connected!")
        _db = res.db()
        cb()
    })
    .catch(e => {
        console.log(e)
    })
}

const getDb = () => {
    if(_db){
        return _db
    }
    throw "No db found"
}

module.exports.mongoConnect = mongoConnect
module.exports.getDb = getDb