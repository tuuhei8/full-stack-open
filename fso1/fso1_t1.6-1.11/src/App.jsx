import { useState } from 'react'

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const StatisticLine = (props) => <tr><td>{props.text}</td><td>{props.value}</td></tr>
  
const Statistics = (props) => {
  const { statGood, statNeutral, statBad } = props
  const all = statGood + statNeutral + statBad
  const average = (statGood + -statBad) / all
  const positive = statGood * 100 / all + ' %'
  
  if (all === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={statGood} />
          <StatisticLine text="neutral" value={statNeutral} />
          <StatisticLine text="bad" value={statBad} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)

  const handleNeutral = () => setNeutral(neutral + 1)
  
  const handleBad = () => setBad(bad + 1)
 
  return (
    <div>
      <div>
        <h1>give feedback</h1>
      </div>
      <div>
        <Button text='good' handleClick={handleGood}/>
        <Button text='neutral' handleClick={handleNeutral}/>
        <Button text='bad' handleClick={handleBad}/>
      </div>
      <div>
        <h1>statistics</h1>
        <Statistics statGood={good} statNeutral={neutral} statBad={bad}/>
      </div>
    </div>
  )
}

export default App