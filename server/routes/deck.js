const deckController = require("../controller/deck")
const express = require('express')
const router = express.Router()
const {validateParams, validateBody, schemas} = require("../helper/validator")


router.route('/')
    .get(deckController.index)
    .post(deckController.createDeck)

router.route('/:deckID')
    .get(validateParams(schemas.idSchema.deckID,"deckID"), deckController.getDeck)
    .put(validateParams(schemas.idSchema.deckID,"deckID"), validateBody(schemas.deckSchema),deckController.replaceDeck)
    .patch(validateParams(schemas.idSchema.deckID,"deckID"),validateBody(schemas.deckSchema),deckController.updateDeck)
    .delete(validateParams(schemas.idSchema.deckID,"deckID"),deckController.deleteDeck)

module.exports = router