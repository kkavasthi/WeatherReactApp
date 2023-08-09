import React, { useState, useEffect } from 'react';

const App = () => {
  const [dataFromApi, setDataFromApi] = useState({});
  const [searchCity, setSearchCity] = useState('');
  const [fetchCity, setFetchCity] = useState('');
  const [error, setError] = useState('');
  const [isCelsius, setIsCelsius] = useState(false);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isKelvin, setIsKelvin] = useState(true);
  
  useEffect(() => {
    
    setError('');
    if (fetchCity.trim() !== '') {
      // Fetch data from the first API based on the entered city name
      const firstApiUrl = `/weather/v1/prediction/${fetchCity}`;
      
      const fetchDataFromApi = async () => {
        
        try {
          const response = await fetch(firstApiUrl);
         
          if (!response.ok) {
            if(response.status===500)
            {
              throw new Error('Entered search city not found');
            }
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('response', data);

          setDataFromApi(data);
          setError('');
        } catch (error) {
          setDataFromApi({});
          setError(error.message);
          console.error('Error fetching data from API:', error);
        }
      };

      fetchDataFromApi();
    } 
    else {
      // If searchCity is empty, reset data from the first API
        setDataFromApi({});
        setError('');
      } 
  }, [fetchCity]);

  const handleSearchChange = (event) => {
    setSearchCity(event.target.value);
    
    
  };

  const handleKeyDown = (event) => {
    
    if (event.keyCode === 13) {
      // Set the state to indicate that the Enter key has been pressed
      setFetchCity(searchCity);
      event.preventDefault(); // Prevent form submission on Enter key press
      setSearchCity('');
    }
  };

  const convertToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

 const convertToFahrenheit = (kelvin) => {
    return (kelvin - 273.15) * 9 / 5 + 32;
  };

  const handleClickDegreeCelcius = () => {
    setIsCelsius(true);
    setIsFahrenheit(false);
    setIsKelvin(false);
   
  };

  const handleClickFahrenheit = () => {
    setIsCelsius(false);
    setIsFahrenheit(true);
    setIsKelvin(false);
    
  };

  const handleClickKelvin = () => {
    setIsCelsius(false);
    setIsFahrenheit(false);
    setIsKelvin(true);
  };
  let weatherDataToDisplay = dataFromApi.weatherResponse?.cityWeatherAPIResponseList || [];

  if (isCelsius) {
    weatherDataToDisplay = weatherDataToDisplay.map((item) => ({
      ...item,
      highTemperature: convertToCelsius(item.highTemperature),
      lowTemperature: convertToCelsius(item.lowTemperature),
    }));
  } else if (isFahrenheit) {
    weatherDataToDisplay = weatherDataToDisplay.map((item) => ({
      ...item,
      highTemperature: convertToFahrenheit(item.highTemperature),
      lowTemperature: convertToFahrenheit(item.lowTemperature),
    }));
  } else if(isKelvin){
    weatherDataToDisplay = weatherDataToDisplay.map((item) => ({
      ...item,
      highTemperature: item.highTemperature,
      lowTemperature: item.lowTemperature,
    }));
  }

  return (
    <div className="App">
      <main>
        <div className='search-box'>
                 {/* Search box */}
          <input
            type="text"
            className='search-bar'
            value={searchCity}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter city name"
            style={{ marginTop: '20px', padding: '10px' }}
          />
          <div className='button'>
            <button onClick={handleClickDegreeCelcius}>°C</button>
            <span className='pipeline'>|</span>
            <button onClick={handleClickFahrenheit}>°F</button>
            <span className='pipeline'>|</span>
            <button onClick={handleClickKelvin}>°K</button>
          </div>

        </div>
            
         <div className='response-field'>
            {error && searchCity.trim() !== '' && <p style={{color:'white'}}>{error}</p>}

            {dataFromApi && Object.keys(dataFromApi).length > 0 && dataFromApi.weatherResponse && (
              <div>
                <ul>
                  <li>
                    <p style={{color:'white', margin:'10px'}}>City: {dataFromApi.weatherResponse.city}</p>
                    <p style={{color:'white', margin:'10px'}}>Country: {dataFromApi.weatherResponse.country}</p>
                  </li>
                </ul>
                <ul>
                  <li>
                    <div style={ {display: 'flex' }}>
                      {weatherDataToDisplay.map((item,index) => (
                        <div key={index} style={{ flex: 1, margin: '10px' }}>
                            <p style={{color:'white',  margin:'10px'}}>Date: {item.date} </p>
                            <p style={{color:'white', margin:'10px'}}>HighTemp:{item.highTemperature.toFixed(2)}</p> 
                            {/* (isFahrenheit ? convertToFahrenheit(item.highTemperature).toFixed(2) : (isKelvin ? item.highTemperature : item.highTemperature))}</p> */}
                            <p style={{color:'white', margin:'10px'}}>LowTemp:{item.lowTemperature.toFixed(2)}</p> 
                            {/* (isFahrenheit ? convertToFahrenheit(item.lowTemperature).toFixed(2) : (isKelvin ? item.lowTemperature : item.lowTemperature))}</p> */}
                            <p style={{color:'white', margin:'10px'}}>WindSpeed:{item.windSpeed}</p>
                            <p style={{color:'white', margin:'10px'}}>Rain:{item.rain.toString()}</p>
                            <p style={{color:'white', margin:'10px'}}>Thunder:{item.thunderstorm.toString()}</p>
                            <p style={{color:'white', margin:'10px'}}>Suggestion:</p>
                            <ul>
                              {item.action.map((action,index)=>(
                                <li style={{color:'white', margin:'10px', marginLeft:'40px'}} key={index}>{action}</li>
                              ))}               
                            </ul>
                        </div>
                        )
                      )}
                    </div>
                  </li>
                </ul>
              </div>
              
            )}
            
      </div> 
    
    </main>     
  </div>
  );
};

export default App;