const Weather = ( { weather, city} ) => {
  
  if (weather && city.includes(weather.name)) {
    
    return (
      <>
        <h2>Weather in {city}</h2>
        <p>{weather.main.temp}</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" />
        <p>{weather.weather[0].description}</p>
      </>
    )
  } else {
    return
  }
}

export default Weather