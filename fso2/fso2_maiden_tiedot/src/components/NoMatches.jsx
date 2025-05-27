const NoMatches = (props) => {
  const { countries, filter } = props
  if (!countries.find(country => country.name.common.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))) {
    return <p>No matches.</p>
  }
}

export default NoMatches