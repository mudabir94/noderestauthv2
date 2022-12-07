const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")

const userSchema=new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: false,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:false,
        }
    }],
},

{
    timestamps:true
})

userSchema.methods.toJSON=  function () {
    const user=this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken= async function () {
    const user = this
    const token= jwt.sign({_id:user._id.toString() },"blogapitoken")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (name,password) => {
    console.log(name)
    const user=await User.findOne({ name })
    if (!user){
        throw new Error("Unable to Login")
    }

    const isMatch= await bcrypt.compare(password,user.password)
    if (!isMatch){
        throw new Error("Unable to Login")
    }
    return user
}
// Hash the plain text password before saving --- Middleware
userSchema.pre("save",async function (next) {
    const user=this
    if (user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)

    }
    next()

})



const User=mongoose.model("Users",userSchema)
module.exports = User