const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
/*
const url = `mongodb+srv://tuuhei:${password}@cluster0.phygv1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
*/
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)