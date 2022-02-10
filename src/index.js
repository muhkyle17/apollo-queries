import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://71z1g.sse.codesandbox.io/',
  cache: new InMemoryCache(),
})

const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`

client
  .query({
    query: gql`
      query GetDogs {
        dogs {
          id
          breed
        }
      }
    `,
  })
  .then((result) => console.log(result))

const GET_DOG_PHOTO = gql`
  query Dog($breed: String!) {
    dog(breed: $breed) {
      id
      displayImage
    }
  }
`

function Dogs({ onDogSelected }) {
  const { loading, error, data } = useQuery(GET_DOGS)

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <select name='dog' onChange={onDogSelected}>
      {data.dogs.map((dog) => (
        <option key={dog.id} value={dog.breed}>
          {dog.breed}
        </option>
      ))}
    </select>
  )
}

function DogPhoto({ breed }) {
  const { loading, error, data, refetch } = useQuery(GET_DOG_PHOTO, {
    variables: { breed },
    pollInterval: 500,
  })

  if (loading) return null
  if (error) return `Error! ${error}`

  return (<img
    src={data.dog.displayImage}
    style={{ height: 100, width: 100 }}
  />)(<button onClick={() => refetch()}>Refetch!</button>)
}

function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      <Dogs />
      <DogPhoto />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
