import { useQuery } from "@apollo/client/react"
import { USER_INFO } from "../queries/queries"
import { ALL_BOOKS } from '../queries/queries'
import { useState, useEffect } from "react"
import LoginForm from "./LoginForm"

const Recommend = (props) => {
  const user = useQuery(USER_INFO)
  const [genre, setGenre] = useState(null)
  const author = null
  const library = useQuery(ALL_BOOKS, {
        variables: { author, genre }
      })

  useEffect(() => {
    if (user.data) {
      if (user.data.me) {
        const favorite = user.data.me.favoriteGenre
        setGenre(favorite)
        props.setFavGenre(favorite)
      }
    }
  }, [user.data])

  if (!props.show) {
    return null
  }

  if (!props.token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm
          setToken={props.setToken}
        />
      </div>
    )
  }

  if (user.loading || library.loading)  {
    return <div>loading...</div>
  }

  const recommendations = library.data.allBooks

  const klik = () => {
    console.log(genre, recommendations[0].genres.includes(genre))
  }

  if (!recommendations[0]) {
    return (
      <div>
        no books
      </div>
    )
  }

  if (!recommendations[0].genres.includes(genre)) {
    return (
      <div>
        No books matched your favorite genre: {genre}
      </div>
    )
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendations.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
     <button onClick={klik}>klik</button>
    </div>
  )

}

export default Recommend