const mongoose = require('mongoose')

mongoose.connect(MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    console.log("Connection estabilished")
)
