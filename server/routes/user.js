const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()
const userController = require('../controller/user')
const {validateBody, validateParams, schemas} = require('../helper/validator')
const { route } = require('./deck')
const config = require("../middware/passport")
const passport = require("passport")

router.route('/')
    .get(userController.index)
    .post(validateBody(schemas.userSchema),userController.createUser)

router.route('/auth/google')
    .post(passport.authenticate("google-plus-token", {session:false}), userController.authGoogle)
    
router.route('/signin')
    .post(validateBody(schemas.authSignin),passport.authenticate("local", {session: false}) ,userController.signin)

router.route('/signup')
    .post(validateBody(schemas.authSignup) ,userController.signup)

router.route('/secret')
    .get(passport.authenticate("jwt", {session: false}) ,userController.secret)

router.route('/:userID')
    .get(validateParams(schemas.idSchema, 'userID'), userController.getUser)
    .put(validateBody(schemas.userSchema), validateParams(schemas.idSchema,'userID'), userController.replaceUser)
    .patch(validateBody(schemas.optionalUserSchema), validateParams(schemas.idSchema,'userID') ,userController.updateUser)

router.route('/deck/:userID')
    .get(validateParams(schemas.idSchema, 'userID'), userController.getUserDecks)
    .post(validateBody(schemas.deckSchema), validateParams(schemas.idSchema,'userID'), userController.createUserDeck)
    
module.exports = router