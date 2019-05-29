const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const Data = require('./data')
const dotenv = require('dotenv')

const API_PORT = 3001


// A souçon of Express
const app = express()
const router = express.Router()

// cors
app.use(cors())

// To read .env...
dotenv.config()




// Mongoose
var mongoose = require('mongoose')
mongoose.set('debug', true)
var mongoDB = process.env.DB_CREDS
console.log(mongoDB)
mongoose.connect(mongoDB, { useNewUrlParser: true })
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))

// (optional) only used for logginf and bodyParser, parses the request body to JSON format
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(logger('dev'))

// this is our get method
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err})
    return res.json({ success: true, data: data})
  })
})

// this is our update method
// this method overwrites existing data in the database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err})
    return res.json( { success: true })
  })
})

// this is our delete method
// this method removes existing data from our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.json({ success: true })
    return res.json({ success: true })    
  })
})

// this is our create method
// this method adds new data to the database
router.post('/putData', (req, res) => {
  let data = new Data()

  const { id, message } = req.body

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    })
  }

  data.message = message
  data.id = id
  data.save((err) => {
    if(err) return res.json({ success: false, error: err })
    return res.json({ success: true })
  })
})

// append /api for our http requests
app.use('/api', router)

// Launch our backend
app.listen(API_PORT, () => console.log(`API LISTENING ON PORT ${API_PORT}`))

