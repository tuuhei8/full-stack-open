import ShowCountry from "./ShowCountry"

const CountryList = (props) => {
  const { listLength, country, onClick, showDetails, setCity, city, getWeather, weather } = props
  if (listLength === 1) {
    return <ShowCountry country={[country]}
    showDetails={true} 
    setCity={setCity} 
    city={city} 
    getWeather={getWeather}
    weather={weather} />
  } else if (listLength < 10 && listLength > 1 && !showDetails) {
    return <li>{country.name.common} <button onClick={onClick}>show</button></li>
  }
}

export default CountryList