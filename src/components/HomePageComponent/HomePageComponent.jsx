import React, { useEffect, useState } from 'react'
import SearchBarComponent from '../SearchBarComponent/SearchBarComponent'
import './HomePageComponent.css'

const HomePageComponent = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        // console.log('From HomePageComponent: ')
        // console.log(data);
    },[data]);

  return (
    <React.Fragment>
      <div className="container">
        <h1 className="header">Weather app</h1>
        <div className="dashboard">
            <div className="location">
                <h2>Enter a city name:</h2>
                <SearchBarComponent func={setData}/>
            </div>
        </div>
        <div className="forecast-container">
          
          <div className="weather">
              {/* <h2 className="City-name">City Name</h2>
              <div className="city-temp">Temperature</div>
              <div className="weather-desc">Weather</div> */}
              {data && data.location && (
                <div>
                  <h3>Location: {data.location.name}, {data.location.region}, {data.location.country}</h3>
                  <h3>Local TimeZone: {data.location.tz_id}</h3>
                  <h3>Local Time: {data.location.localtime}</h3>
                </div>
              )}
          </div>
          <div className="forecast">
            {
              data && data.current && (
                <div>
                  <h3>Current Weather</h3>
                  <img src={data.current.condition.icon} alt={data.current.condition.text} />
                  <h3>{data.current.condition.text}</h3>
                  <h3>{data.current.temp_c}°C</h3>
                </div>
              )
            }
          </div>
        </div>
      </div>
        
    </React.Fragment>
  )
}

export default HomePageComponent