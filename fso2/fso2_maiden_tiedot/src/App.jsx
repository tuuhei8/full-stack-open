import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import FilterSection from './components/FilterComponent'
import CountryList from './components/CountryList'
import TooMany from './components/TooMany'
import NoMatches from './components/NoMatches'
import ShowCountry from './components/ShowCountry'
import axios from 'axios'

function App() {
  const API_key = import.meta.env.VITE_SOME_KEY
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [showCountry, setShowCountry] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)

  const handleFilter = (event) => {
    setFilter(event.target.value)
    setShowDetails(false)
  }

  let countriesToShow = countries.filter(country => 
    country.name.common.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))

  const show = (countryToShow) => {
    const newCountryList = countriesToShow.filter(country => country.name.common === countryToShow)
    setShowDetails(true)
    setShowCountry(newCountryList)
  }
  
  const getWeather = () => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`)
      .then(response =>
        setWeather(response.data)
      )
      .catch(error =>
        console.log('getWeather error:', error)
      )
  }

  useEffect(() => {
    countriesService
      .getAll()
      .then(allCountries => {
      setCountries(allCountries)
      })
      .catch(error => {
        console.log('useEffect error:', error)
        alert('Problem acquiring data from database')
      })
  }, [])

  return (
    <>
      <h1>Countries</h1>
      <FilterSection filterValue={filter} filterOnChange={handleFilter} />
      <TooMany listLength={countriesToShow.length} />
      <NoMatches countries={countriesToShow} filter={filter} />
      <ul>
        <ShowCountry country={showCountry}
        showDetails={showDetails}
        setCity={() => setCity(showCountry[0].capital[0])}
        city={city}
        getWeather={getWeather}
        weather={weather} />
        {
          countriesToShow.map((country, index) => <CountryList key={index}
          listLength={countriesToShow.length}
          country={country}
          showDetails={showDetails}
          onClick={() => show(country.name.common)}
          setCity={() => setCity(country.capital[0])}
          city={city}
          getWeather={getWeather}
          weather={weather} />)
        }
      </ul>
    </>
  )
}

export default App
