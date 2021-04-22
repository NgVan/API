const User = require("../model/user")
const Deck = require("../model/deck")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const { set } = require("mongoose")
const config = require("../config/index.js")

const encodeToken = (userID) => {
    return jwt.sign({
        iss: "CodeWorker",
        sub: userID,
        iat: new Date().getTime(), //current time
        exp: new Date().setDate(new Date().getDate() + 2) // current time + 1 day ahead
    },config.JWT_secretKey)
}
const authGoogle = async (req,res,next) => {
    console.log("authGoogle function: ", req.user)
    const token = encodeToken(req.user._id)
    console.log("TokenSingIn: ", token)
    res.setHeader("Authentication", token)
    return res.status(201).json({success: true})
}

const createUser = async (req,res, next) => {
    try{
        const newUser = new User(req.value.body)
        await newUser.save()
        return res.status(201).json({user: newUser})
    } catch (error) {
        next(error)
    }
}

const createUserDeck = async (req,res,next) => {
    // get userID
    // create userDeck from req.body
    const {validParam} = req.value.params
    const foundUserID = await User.findById(validParam)
    if (!foundUserID)
        return res.status(403).json({error: {message: "User is not exist in system"}})
    const newUserDeck = new Deck(req.value.body)
    newUserDeck.users = validParam
    await newUserDeck.save()
    const user = await User.findById(validParam)
    user.decks.push(newUserDeck._id)
    await user.save()
    return res.status(201).json({deck: newUserDeck})
}

const getUser = async (req,res,next) => {
    // get userID param
    // FindbyID
    // return
    const { validParam } = req.value.params
    console.log("Getuser", validParam)
    const user = await User.findById(validParam)
    return res.status(200).json({user: user})
}

const getUserDecks = async (req,res,next) => {
    const {userID} = req.params
    const userDecks = await User.findById(userID).populate('decks')
    return res.status(200).json({deck: userDecks.decks})
    
}

const index = async (req, res, next) => {
    try {
        const user = await User.find({})
        return res.status(200).json({user: user})
    } catch (error) {
        next(error)
    }
}

const replaceUser = async (req,res,next) => {
    // get userID param
    // get body
    // findByIdandReplace
    // return
    const {userID} = req.params
    const user = await User.findByIdAndUpdate(userID, req.body)
    return res.status(201).json({success: true})
}

const updateUser = async (req,res,next) => {
    const {userID} = req.params
    const user = await User.findByIdAndUpdate(userID, req.body)
    return res.status(201).json({success: true})
}

const signin = async (req,res,next) => {
    console.log("This is signin function")
    const token = encodeToken(req.user._id)
    console.log("TokenSingIn: ", token)
    res.setHeader("Authentication", token)
    return res.status(201).json({success: true})
}

const signup = async (req,res,next) => {
    console.log("This is signup funcetion")
    const { firstName, lastName, email, password } = req.value.body
    const foundEmail = await User.findOne({email})
    console.log("foundEmail :", foundEmail)
    if (foundEmail) 
        return res.status(403).json({error: {message: "Email is exist in system"}})
    const newUser = new User({firstName, lastName, email, password})
    await newUser.save()
    console.log("newUserSignUp :", newUser)

    const token = encodeToken(newUser._id)
    console.log("tOken", token)
    res.setHeader('Authentication', token)
    return res.status(201).json({success: true})
}

const secret = async (req,res,next) => {
   return res.status(201).json({success: true})
}

module.exports = {
    authGoogle,
    createUser,
    createUserDeck,
    getUser,
    getUserDecks,
    index,
    replaceUser,
    updateUser,
    signin,
    signup,
    secret    
}