require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const userRouter = require('./routes/user')
const deckRouter = require('./routes/deck')
//import mongoose from 'mongoose'
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userModel = require('./model/user')

const app = express()

    mongoose.connect('mongodb://localhost/src', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log("Server is connected with MongoDB"))
.catch((error) => console.error("Do not connect MongoDB"))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Middleware
app.use(logger('dev'))

// Routes
app.use('/user', userRouter)
app.use('/deck', deckRouter)

// Catch 404 error

app.use((req, res, next) => {
    const err = new Error('Not found 404')
    err.status = 404
    next(err)
})


// Error handle function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development'? err : {}
    const status = err.status || 500

    return res.status(status).json({
        error : {
            messageApp: err.message
        }
    })
})

// Start server
const port = app.get('port') || 3000
app.listen(port, () => console.log(`App listen on port ${port}`))
