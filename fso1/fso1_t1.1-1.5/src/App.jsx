const Header = (props) => {
  return (
    <h1>{props.kurssi.name}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.osa.name} {props.osa.exercises}</p>
  )
}

const Content = (props) => {
  return (
    <>
      <Part osa={props.kurssi.parts[0]}/>
      <Part osa={props.kurssi.parts[1]}/>
      <Part osa={props.kurssi.parts[2]}/>
    </>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.kurssi.parts[0].exercises + props.kurssi.parts[1].exercises + props.kurssi.parts[2].exercises}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header kurssi={course} />
      <Content kurssi={course}/>
      <Total kurssi={course}/>
    </div>
  )
}

export default App
