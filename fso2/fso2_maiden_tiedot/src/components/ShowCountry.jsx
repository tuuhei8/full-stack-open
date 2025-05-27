import Weather from "./Weather"

const ShowCountry = ( { country, showDetails, setCity, city, getWeather, weather }) => {
  if (country.length === 1 && showDetails) {
    const name = country[0].name.common
    const capital = country[0].capital[0]
    const languages = Object.values(country[0].languages)
    const removeStyling = {
      listStyleType: 'none'
    }
    const listStyle = {
      listStyleType: 'disc'
    }
    
    return (
      <li style={removeStyling} onLoad={setCity}>
        <h1>{name}</h1>
        <p>
          Capital: {capital}<br/>
          Area: {country[0].area}
        </p>
        <h1>Languages</h1>
        <ul style={listStyle}>
          {
            languages.map((language, index) => {
              return <li key={index}>{language}</li>
            })
          }
        </ul>
        <img src={country[0].flags.png} alt={country[0].flags.alt} />
        <button onClick={getWeather}>Show Weather</button>
        <Weather city={city} weather={weather}/>
      </li>
    )
  }
}

export default ShowCountry