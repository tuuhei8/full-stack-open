require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')

morgan.token('data', function (req) { return JSON.stringify(req.body)  })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('dist'))

const generateID = () => {
  const id = Math.floor(Math.random() * 1000)
  return String(id)
}
/*
let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
  ]
*/
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
      })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
 /*
  const existingPerson = ''

  if (existingPerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
*/
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})
/*
app.get('/info', (request, response) => {
  const d = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p>${d}`)
})
*/
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
