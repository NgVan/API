const User = require("../model/user")
const Deck = require("../model/deck")
const bodyParser = require('body-parser')

const createDeck = async (req, res, next) => {
    //input: userID, title, description
    //output: newDeck, push Deck to User
    const deck = req.body
    const userID = deck.users
    const userFind = await User.findById(userID)
    delete deck.users
    deck.users = userFind._id
    await newDeck.save()
    userFind.decks.push(newDeck._id)
    await userFind.save()
    return res.status(201).json({createdDeck: newDeck})
}

const deleteDeck = async (req, res, next) => {
    const {deckID} = req.params
    const deck = await Deck.findById(deckID)
    const userID = deck.users
    const user = await User.findById(userID)
    await deck.remove()
    user.decks.pull(deck._id)
    await user.save()
    return res.status(200).json({Delete_deck: true})
}

const getDeck = async (req, res, next) => {
    const {deckID} = req.params
    const deck = await Deck.findById(deckID)
    console.log("List Deck", deck)

    return res.status(200).json({deck: deck})
}

const index = async (req,res,next) => {
    const decks = await Deck.find({})
    return res.status(200).json({deckList: decks})
}

const updateDeck = async (req, res, next) => {
    const {deckID} = req.params
    const replaceDeck = await Deck.findByIdAndUpdate(deckID, req.body)
    return res.status(200).json({success: true})
}

const replaceDeck = async (req, res, next) => {
    const {deckID} = req.params
    const replaceDeck = await Deck.findByIdAndUpdate(deckID, req.body)
    return res.status(200).json({success: true})
}

module.exports = {
    createDeck,
    deleteDeck,
    getDeck,
    index,
    updateDeck,
    replaceDeck
}