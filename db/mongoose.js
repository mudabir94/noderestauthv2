const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    console.log("Connection estabilished")
)
