const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const bcryptjs = require("bcryptjs")
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: { type: String},
    lastName: { type: String},
    email: { 
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    typeOauth: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local"
    },
    googleID: {
        type: String,
        default: null
    },
    facebookID: {
        type: String,
        default: null
    },
    decks: [{
        type: Schema.Types.ObjectID,
        ref: "Deck"
    }]
})

userSchema.pre("save", async function (next){
    try {
        if(this.typeOauth !== 'local')
            next();
        const salt = await bcryptjs.genSalt(10)
        const passwordHash = await bcryptjs.hash(this.password, salt)
        this.password = passwordHash
        console.log("passwordHashed: ", this.password)
        next();
    } catch (error) {
        next(error)
    }

})

userSchema.methods.isValidPassword = async function(password) {
    try {
        return bcryptjs.compare(password, this.password) 
    } catch (error) {
        throw new Error(error)
    }
}

const User = mongoose.model("User", userSchema);
module.exports = User