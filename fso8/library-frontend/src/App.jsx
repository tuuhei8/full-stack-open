import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LogoutButton from "./components/Login";
import Recommend from "./components/Recommend";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import { BOOK_ADDED, ALL_BOOKS } from "./queries/queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const [favGenre, setFavGenre] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useEffect(() => {
    if (localStorage.getItem('user-token')) {
      setToken(localStorage.getItem('user-token'))
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`Added a new book with title: ${data.data.bookAdded.title}.`)

      client.cache.updateQuery({ query: ALL_BOOKS, variables: { author: null, genre: null } },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(addedBook)
          }
      })
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
        <LogoutButton logout={logout} token={token} />
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} favGenre={favGenre} setToken={setToken} token={token} />

      <Recommend show={page === "recommend"} setFavGenre={setFavGenre} setToken={setToken} token={token} />
    </div>
  );
};

export default App;
