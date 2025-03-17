//Actividad Promesas React
//Autores: Edgar Andres Torres - Santiago Andres Chamorro
import  { useState, useEffect, useCallback } from 'react';
import Person from './Person';
import SearchForm from './SearchForm';
import './App.css';
import axios from 'axios';

function App () {
  const [people, setPeople] = useState([]);
  const [gender, setGender] = useState();
  const [country, setCountry] = useState('US');
  
  const findPeopleAxios = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const url = `https://randomuser.me/api/?results=12&gender=${gender}&nat=${country}`;
      const { data: { results } } = await axios.get(url);
      setPeople(results);
    } catch (error) {
      if (error.response) {
        console.error('Error HTTP:', error.response.status);
      } else if (error.request) {
        console.error('Error de red:', error.message);
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [gender, country, isLoading]);
  
  const findPeopleFetch = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
  
    try {
      const url = `https://randomuser.me/api/?results=12&gender=${gender}&nat=${country}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const { results } = await response.json();
      return results;
    } catch (error) {
      console.error('Error en Fetch:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [gender, country, isLoading]);
  
  const compareResponses = useCallback(async () => {
    const axiosPromise = axios.get(`https://randomuser.me/api/?results=12&nat=${country}`);
    const fetchPromise = fetch(`https://randomuser.me/api/?results=12&nat=${country}`)
      .then(res => res.json());
  
    const [axiosResponse, fetchResponse] = await Promise.all([axiosPromise, fetchPromise]);
    
    console.log('Tiempo Axios:', axiosResponse.duration);
    console.log('Tiempo Fetch:', fetchResponse.duration);
    setPeople({
      axios: axiosResponse.data.results,
      fetch: fetchResponse.results
    });
  }, [country]);

  /*
  const [people, setPeople] = useState({
    axios: [],
    fetch: []
  });
  const [isLoading, setIsLoading] = useState(false);

  */
  
  const handleGender = (event) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);
  }

  const handleCountry = (event) => {
    setCountry(event.target.value);
  }

  return (
    <div className="App-people">
      <div>
        <h2>Resultados Axios</h2>
        {people.axios.map((person) => (
          <Person key={person.login.uuid} person={person} />
        ))}
      </div>
      <div>
        <h2>Resultados Fetch</h2>
        {people.fetch.map((person) => (
          <Person key={person.login.uuid} person={person} />
        ))}
      </div>
    </div>
  );
}

export default App;
