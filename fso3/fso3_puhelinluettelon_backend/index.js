const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

morgan.token('data', function (req) { return JSON.stringify(req.body)  })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

const generateID = () => {
  const id = Math.floor(Math.random() * 1000)
  return String(id)
}

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

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const existingPerson = persons.find(person => person.name === body.name)

  if (existingPerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateID()
  }

  persons = persons.concat(person)
  console.log('loki:', person)
  response.json(person)
})

app.get('/info', (request, response) => {
  const d = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p>${d}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
