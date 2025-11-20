import { useState, useEffect } from 'react';
import axios from 'axios';
import diaryService from './services/diaries';

import type { NonSensitiveDiaryEntry, ValidationError } from './types';

function App() {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('great');
  const [weather, setWeather] = useState('sunny');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const errorColor = {
    color: 'red'
  };

  useEffect(() => {
    diaryService.getAll().then(response => {
      setDiaryEntries(response);
    });
  }, []);

  const newDiaryEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newEntry = {
      date: date,
      weather: weather,
      visibility: visibility,
      comment: comment
    };
    try {
      const response = await diaryService.postNewEntry(newEntry);
      const resEntryToAdd = {
        id: response.id,
        date: response.date,
        weather: response.weather,
        visibility: response.visibility
      };
      setDiaryEntries(diaryEntries.concat(resEntryToAdd));
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        console.log(error.status);
        console.error(error.response);
        if (error.response?.data && typeof error.response?.data === 'string') {
          setErrorMessage(error.response?.data);
          errorTimeOut();
        } else {
          setErrorMessage('unknown axios error');
          errorTimeOut();
        }
      } else {
        console.error(error);
        setErrorMessage('unknown error');
        errorTimeOut();
      }
    }
    setComment('');
  };

  const errorTimeOut = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  return (
    <div>
      <h2>Add diary entry</h2>
      <p style={errorColor}>{errorMessage}</p>
      <form onSubmit={newDiaryEntry}>
        <label htmlFor="date">date:</label>
        <input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><br />
        {"visibility: "}<label htmlFor="great">great</label>
        <input id="great" type="radio" name="visibility" value="great" defaultChecked onChange={(event) => setVisibility(event.target.value)} />
        <label htmlFor="good">good</label>
        <input id="good" type="radio" name="visibility" value="good" onChange={(event) => setVisibility(event.target.value)} />
        <label htmlFor="ok">ok</label>
        <input id="ok" type="radio" name="visibility" value="ok" onChange={(event) => setVisibility(event.target.value)} />
        <label htmlFor="poor">poor</label>
        <input id="poor" type="radio" name="visibility" value="poor" onChange={(event) => setVisibility(event.target.value)} /><br />
        {"weather: "}<label htmlFor="sunny">sunny</label>
        <input id="sunny" type="radio" name="weather" value="sunny" defaultChecked onChange={(event) => setWeather(event.target.value)} />
        <label htmlFor="rainy">rainy</label>
        <input id="rainy" type="radio" name="weather" value="rainy" onChange={(event) => setWeather(event.target.value)} />
        <label htmlFor="cloudy">cloudy</label>
        <input id="cloudy" type="radio" name="weather" value="cloudy" onChange={(event) => setWeather(event.target.value)} />
        <label htmlFor="stormy">stormy</label>
        <input id="stormy" type="radio" name="weather" value="stormy" onChange={(event) => setWeather(event.target.value)} />
        <label htmlFor="windy">windy</label>
        <input id="windy" type="radio" name="weather" value="windy" onChange={(event) => setWeather(event.target.value)} /><br />
        <label htmlFor="comment">comment:</label>
        <input id="comment" type="text" value={comment} onChange={(event) => setComment(event.target.value)} /><br />
        <button type="submit" >submit</button>
      </form>
      <h2>Diary Entries</h2>
      {diaryEntries.map(d => 
        <p key={d.id}>
          <strong>{d.date}</strong><br /><br />
          visibility: {d.visibility}<br />
          weather: {d.weather}
        </p>
      )}
    </div>
  );
}

export default App;
