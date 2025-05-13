import { useState } from 'react'

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const Votes = (props) => <>has {props.text} votes</>

 const CountVotes = (props) => {
    let mostPopular = props.text[0]
    let most = 0
    let i = 0

    for (i = 0; i < props.votes.length; i++) {
      if (props.votes[i] > most) {
        mostPopular = props.text[i]
        most = props.votes[i]
      }
    }

    return (
      <>{mostPopular}<br/>has {most} votes</>
    )
  }

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const votesArray = new Array(anecdotes.length).fill(0)
   
  const [selected, setSelected] = useState(0)

  const [votes, setVotes] = useState(votesArray)

  const votesCopy = [...votes]

  const handleRandom = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  const handleVote = () => {
    votesCopy[selected] += 1
    setVotes(votesCopy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}<br/>
      <Votes text={votes[selected]}/><br/>
      <Button text='vote' handleClick={handleVote}/>
      <Button text='next anecdote' handleClick={handleRandom}/>
      <h1>Anecdote with most votes</h1>
      <CountVotes text={anecdotes} votes={votes}/>
    </div>
  )
}

export default App