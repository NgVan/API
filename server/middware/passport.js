var passport = require("passport")
var JwtStrategy = require("passport-jwt").Strategy
var ExtractJwt = require("passport-jwt").ExtractJwt
var LocalStrategy = require("passport-local").Strategy
var GooglePlusTokenStrategy = require("passport-google-plus-token")
var config = require("../config/index.js")
var User = require("../model/user")

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
    secretOrKey: config.JWT_secretKey,
    issuer: "CodeWorker"
}, async (payload, done)=> {
    try {
        const user = await User.findById(payload.sub)  
        console.log("payload", payload) 
        if(user) return done(null, user)
        else return done(null, false)
    } catch (error) {
        return done(error, false)
    }
}))

passport.use(new GooglePlusTokenStrategy({
    clientID: "593315144888-cqi9epfktj7geovuopkoh343va8275eq.apps.googleusercontent.com",
    clientSecret:"kAMQLeevIElTntMf_VT760n5"
}, async (accessToken, refreshToken, profile, done)=> {
    try {
        console.log("accessToken: ", accessToken)
        console.log("refreshToken: ", refreshToken)
        console.log("id: ", profile.id)
        console.log("emails: ", profile.emails[0].value)
        console.log("profile: ", profile)
        
        const foundUser = await User.findOne({
            typeOauth: "google",
            googleID: profile.id 
        })
        if(foundUser) {
            console.log("wellcome, you are sign in with google before")
            return done(null, foundUser)
        }
        const user = new User({
            typeOauth: "google",
            googleID: profile.id,
            email: profile.emails[0].value
        })  
        await user.save()    
        return done(null,user)  
    } catch (error) {
        console.log("err: ", error)
        return done(error, false)
    }
}))

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) =>{
    try {
        const foundEmail = await User.findOne({email})
        if(!foundEmail) {
            console.log("Do not found email in system")
            return done(null, false)
        }
        const isPass = await foundEmail.isValidPassword(password)    
        if (isPass)
            return done(null, foundEmail)
        else return done(null, false)    
    } catch (error) {
        return done(error, false)
    }
}))