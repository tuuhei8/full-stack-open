const Header = (props) => <h2>{props.name}</h2>

const Part = (props) => <p>{props.name} {props.exercises}</p> 

const Content = ( { parts } ) => parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>)

const Total = ( { parts } ) => {
  const sum = parts.reduce((total, part) => total + part.exercises, 0)
  return <p><strong>Total of {sum} exercises</strong></p>
}

const Course = (props) => { 
  return (
    <div>
      <Header name={props.name} />
      <Content parts={props.parts}/>
      <Total parts={props.parts}/>
    </div>
  )
}

export default Course