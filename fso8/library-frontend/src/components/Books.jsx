import { useQuery } from '@apollo/client/react'
import { useState } from 'react'

import { ALL_BOOKS } from '../queries/queries'

const Intro = ({ genre, books }) => {
  if (genre && !books[0].genres.includes(genre)) {
    return <div>No books of genre <strong>{genre}</strong> found.<br/><br/></div>
  }

  if (!genre) {
    genre = 'All genres'
  }

  return (
    <div>Found books for genre: <strong>{genre}</strong><br/><br/></div>
  )
}

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const author = null
  const { loading, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { author, genre }
  })

  if (!props.show) {
    return null
  }

  if (loading)  {
    return <div>loading...</div>
  }

  const setGenreFilter = (g) => {
    setGenre(g)
    refetch({ genre: g })
  }

  const books = data.allBooks

  return (
    <div>
      <h2>books</h2>
      <Intro genre={genre} books={books} />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setGenreFilter('refactoring')}>refactoring</button>
        <button onClick={() => setGenreFilter('agile')}>agile</button>
        <button onClick={() => setGenreFilter('patterns')}>patterns</button>
        <button onClick={() => setGenreFilter('design')}>design</button>
        <button onClick={() => setGenreFilter('crime')}>crime</button>
        <button onClick={() => setGenreFilter('classic')}>classic</button>
        <button onClick={() => setGenreFilter(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
