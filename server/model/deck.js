const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const Schema = mongoose.Schema

const deckSchema = new Schema({
    title: {type: String},
    description : {type: String},
    total: {
        type: Number,
        default: 0
    },
    users: [{
        type: Schema.Types.ObjectID,
        ref: "User"
    }]

})

const Deck = mongoose.model("Deck", deckSchema);
module.exports = Deck