const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/nodeblog-test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    console.log("Connection estabilished")
)
