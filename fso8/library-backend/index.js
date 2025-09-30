const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express5')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    phone: Int
    bookCount: Int!
    born: Int
    books: [Book]
  }
  
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    authorCount: Int
    bookCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    addGenre(
      title: String!
      genre: String!
    ): Book
    editAuthor(
      name: String!
      born: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author', { name: 1 })
      let filterSearch = []
      if (args.author) {
        let searchableList = filterSearch.length > 0 ? filterSearch : books
        const authorSearch = searchableList.filter(b => b.author.name === args.author)
        filterSearch = authorSearch
      }
      if (args.genre) {
        let searchableList = filterSearch.length > 0 ? filterSearch : books
        const genreSearch = searchableList.filter(b => b.genres.includes(args.genre))
        filterSearch = genreSearch
      }

      return (
        filterSearch.length > 0 ? filterSearch : books
      )
    },
    allAuthors: async () => Author.find({}).populate('books'),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return root.books.length
    }
  },
  Book: {
    author: async (root) => {
      return {
        name: root.author.name
      }
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author })

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      if (!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('saving new author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      const newBook = new Book({ ...args, author: author })
      const authorToUpdate = await Author.findOne({name: args.author})
      try {
        const book = await newBook.save()
        authorToUpdate.books = authorToUpdate.books.concat(newBook._id)
        await authorToUpdate.save()
        const responseBook = await book.populate('author', { name: 1 })
        pubsub.publish('BOOK_ADDED', { bookAdded: responseBook })
        return responseBook
      } catch (error) {
        throw new GraphQLError('saving new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
    },
    addGenre: async (root, args) => {
      let bookToUpdate = await Book.findOne({ title: args.title })
        if (!bookToUpdate) {
          return null
        }
        bookToUpdate.genres = bookToUpdate.genres.concat(args.genre)
        try {
          const updatedBook = await bookToUpdate.save()
          await updatedBook.populate('author', { name: 1 })
          return updatedBook
        } catch (error) {
           throw new GraphQLError('saving new genre failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.genre,
              error
            }
          })
        }
    },
    editAuthor: async (root, args, context) => {
      let authorToUpdate = await Author.findOne({ name: args.name })

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      if (!authorToUpdate) {
        return null
      }
      authorToUpdate.born = args.born
      try {
        const updatedAuthor = await authorToUpdate.save()
        return updatedAuthor
      } catch (error) {
        throw new GraphQLError('updating year of birth failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.born,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)
   const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  })
  await server.start()
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    }),
  )
  const PORT = 4000
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}
start()