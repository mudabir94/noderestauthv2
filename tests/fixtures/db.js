const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, "blogapitoken")
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: 'myhouse099@@',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, "blogapitoken")
    }]
}



const setupDatabase = async (next) => {
    await User.deleteMany()
   
    await new User(userOne).save()
    await new User(userTwo).save()
    next()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDatabase
}
