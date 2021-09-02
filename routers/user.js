
const express = require('express')
const router = new express.Router()
const auth=require("../middleware/auth")
const User=require("../models/user")

// Get All users
router.get('/users',  async (req, res) => {
    try{
        const users= await User.find({})
        res.send(users)

    }catch(e){
        res.status(400).send()
    }
})
// Get User Profile Info
router.get('/user/me', auth ,async (req, res) => {
    res.send(req.user)
})

// Register New User
router.post('/register-user',  async (req, res) => {

    const user = new User({
        'username':req.body.name,
        'password':req.body.password
    })
    try{
        console.log('before save');

        let saveUser=await user.save()
        console.log(saveUser); //when success it print.

        console.log('after save');

        const token = await user.generateAuthToken()
        res.status(201).send({user,token})

    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }  
})

// Login user 
router.post ("/user/login", async (req,res)=> {
    try{
        const user= await User.findByCredentials(req.body.name, req.body.password)
        const token = await user.generateAuthToken()
        console.log(token)
        res.send({user,token})
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})

// Logout user
router.post ("/user/logout",auth, async (req,res)=> {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

// Logout user from all sessions 
router.post ("/user/logoutAll",auth, async (req,res)=> {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

// Update User Info by id
router.patch("/user/:id", async(req,res)=>{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedUpdates = ['username','email','password']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation){
        res.status().send({"error":"Invalid updates"})
    }
 
    try{

        const user= await User.findById(_id)
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()

        if (!user){
            return res.status(404).send()
        }

        res.send(user)

    }catch(e){
        res.status(500).send(e)
    }
})
// Delete User by id
router.delete("/user/:id",async (req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)
        // await req.user.remove()
        res.send(user)
    }
    catch(e){
        res.status(500).send()
    }
})


module.exports=router 