const TooMany = (props) => {
  if (props.listLength > 10) {
    return <p>Too many matches, specify another filter.</p>
  }
}

export default TooMany