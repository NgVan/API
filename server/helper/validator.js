const Joi = require('joi');

const validateBody = (schema) => {
    return (req, res, next) => {
        const validateBody = schema.validate(req.body)
        console.log ("validateBody : ", validateBody)
        if (validateBody.error) 
            return res.status(400).json(validateBody.error)
        else
            if(!req.value) req.value = {}
            if(!req.value.params) req.value.params ={}
            req.value.body = validateBody.value
            next(); 
    }
}

const validateParams = (schema, name) => {
    return (req,res,next) => {  
        const validateParam = schema.validate({validParam: req.params[name]})
        console.log ("validateParam : ", validateParam)
        if(validateParam.error)
            return res.status(400).json(validateParam.error)
        else {
            if(!req.value) req.value = {}
            if(!req.value.params) req.value.params ={}
            req.value.params = validateParam.value
            next(); 
        }        
    }
}

const schemas = {
    authSignin: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    authSignup: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    deckSchema: Joi.object().keys({
       title: Joi.string().min(5).required(),
       description: Joi.string().min(5).required() 
    }),
    idSchema: Joi.object().keys({
        validParam: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required()
    }),
    newDeckSchema: Joi.object().keys({
        title: Joi.string().min(5).required(),
        description: Joi.string().min(5).required(),
        users: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required()
    }),
    userSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()

    }),
    optionalUserSchema: Joi.object().keys({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email()
    }),
    optionalDeckSchema: Joi.object().keys({
        title: Joi.string().min(5),
        description: Joi.string().min(5),
        users: Joi.string().regex(/^[a-zA-Z0-9]{24}$/)
    })
}

module.exports = {
    validateBody,
    validateParams,
    schemas
}