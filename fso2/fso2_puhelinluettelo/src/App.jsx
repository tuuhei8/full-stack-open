import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Notification from './notifications/Notificaton'

const FilterSection = (props) => {
  return (
    <div>
      Filter shown with: <input type="text"
      value={props.filterValue}
      onChange={props.filterOnChange} />
    </div>
  )
}

const PersonForm = (props) => {
  const { onSubmit, nameValue, nameOnChange, numberValue, numberOnChange } = props
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input type="text"
        value={nameValue}
        onChange={nameOnChange} />
      </div>
      <div>
        number: <input type="text"
        value={numberValue}
        onChange={numberOnChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  if (props.filter.length > 0 && !props.name.toLocaleLowerCase().includes(props.filter.toLocaleLowerCase())) {
    return
  } else {
    return <p>{props.name} {props.number}<button onClick={props.delete}>delete</button></p>
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  const addPerson = (event) => {
    event.preventDefault()
    
    if (newName.length < 1 || newNumber.length < 1) {
      alert('One or more input fields are empty')
      setNewName('')
      setNewNumber('')
      return
    }

    const existingPerson = persons.find(person => person.name.toLocaleLowerCase() === newName.toLocaleLowerCase())
      if (existingPerson) {
        const confirm = window.confirm(`Do you wish to change the number for ${newName}?`)
        if (confirm) {
          changeNumber(existingPerson)
          setNewName('')
          setNewNumber('')
          return
        } else {
          setNewName('')
          setNewNumber('')
          return
        }
      }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personsService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        const newMessage = {
          content: 'New person added',
          class: 'notification'
        }
        resetMessage()
        setMessage(newMessage)
      })
      .catch(error => {
        console.log('addPerson error log:', error)
        const newMessage = {
          content: `${error.response.data.error}`,
          class: 'error'
        }
        setMessage(newMessage)
        resetMessage()
        setPersons(persons)
      })
  }

  const changeNumber = (personToUpdate) => {
    const newPersonObject = {...personToUpdate, number: newNumber}
    personsService
    .change(personToUpdate.id, newPersonObject)
    .then(returnedNewPerson => {
      setPersons(persons.map(person => person.id !== returnedNewPerson.id ? person : returnedNewPerson))
      const newMessage = {
        content: 'Number changed.',
        class: 'notification'
        }
      setMessage(newMessage)
      resetMessage()
    })
    .catch(error => {
      console.log('changeNumber error log:', error)
      const newMessage = {
        content: 'This person has already been removed.',
        class: 'error'
      }
      setMessage(newMessage)
      resetMessage()
      setPersons(persons.filter(person => person.id !== personToUpdate.id))
    })
  }

  const removePersonById = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    const confirm = window.confirm(`Do you really want to delete ${personToDelete.name}?`)
    if (confirm) {
      personsService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== response.id))
          const newMessage = {
            content: 'Person removed.',
            class: 'notification'
          }
          setMessage(newMessage)
          resetMessage()
        })
        .catch(error => {
          console.log('removePersonById error log:', error);
          const newMessage = {
            content: 'This person has already been removed.',
            class: 'error'
          }
          setMessage(newMessage)
          resetMessage()
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  useEffect(() => { 
    personsService
      .getAll()
      .then(initialPersons => {
      setPersons(initialPersons)
      })
      .catch(error => {
        console.log('useEffect error log:', error)
        const newMessage = {
          content: 'Database is empty',
          class: 'error'
        }
        setMessage(newMessage)
        resetMessage()
      })
  }, [])

  const resetMessage = () => {
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleNewName = (event) => setNewName(event.target.value)

  const handleNewNumber = (event) => setNewNumber(event.target.value)

  const handleFilter = (event) => setFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <FilterSection filterValue={filter} filterOnChange={handleFilter}/>
      <h2>Add a new</h2>
      <PersonForm onSubmit={addPerson} nameValue={newName}
      nameOnChange={handleNewName} numberValue={newNumber}
      numberOnChange={handleNewNumber} />
      <h2>Numbers</h2>
      {
        persons.map(person => <Persons key={person.name}
        name={person.name}
        number={person.number}
        filter={filter}
        delete={() => removePersonById(person.id)} />)
      }
    </div>
  )
}

export default App