import { useQuery, useMutation } from '@apollo/client/react'
import { useState } from 'react'

import { ALL_BOOKS } from '../queries/queries'

import { ALL_AUTHORS } from '../queries/queries'

import { EDIT_AUTHOR } from '../queries/queries'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [birthyear, setBirthyear] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
      refetchQueries: [ { query:ALL_BOOKS }, { query:ALL_AUTHORS } ]
    })

  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }
  
  const authors = result.data.allAuthors

  if (!selectedAuthor && authors[0]) {
    setSelectedAuthor(authors[0].name)
  }

  const submit = async (e) => {
    e.preventDefault()
    const name = selectedAuthor
    const born = parseInt(birthyear)

    editAuthor({ variables: { name, born} })
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table><br />
      <div>
        <form onSubmit={submit}>
          <label>
            select author:
            <select name="selectedAuthor" value={selectedAuthor}
              onChange={e => setSelectedAuthor(e.target.value)}
            >
              {authors.map((a) => (
                <option key={a.name} value={a.name}>{a.name}</option>
              ))}
            </select>
          </label><br /><br />
          <input type='text' placeholder='set birthyear' onChange={({ target }) => setBirthyear(target.value)} /><br />
          <button type='submit'>send</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
