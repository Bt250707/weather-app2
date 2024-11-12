import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const SearchBarComponent = ({ func }) => {
	const [inputValue, setInputValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [apiKey] = useState("026adc39d2d8480ebb845109242110");
	const [currentLocation, setCurrentLocation] = useState("");

	const fetchSearch = useCallback(async () => {
		if (inputValue.length < 3) return;

		try {
			const response = await axios.get(
				"http://api.weatherapi.com/v1/search.json?key=" +
					apiKey +
					"&q=" +
					inputValue
			);

			// console.log(response.data);

			setSuggestions(response.data);

			// console.log(suggestions);
		} catch (error) {
			console.log(error);
		}
	}, [inputValue]);

	const fetchWeather = useCallback(async (location) => {
		if (location === "") return;
		try {
			const response = await axios.get(
				"http://api.weatherapi.com/v1/current.json?key=" +
					apiKey +
					"&q=" +
					location
			);

			// console.log(response.data);
			// console.log(typeof response.data);
			func(response.data);

			return response.data;
		} catch (error) {
			console.log(error);
		}
	}, []);

	
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				// console.log(
				// 	position.coords.latitude,
				// 	position.coords.longitude
				// );
				setCurrentLocation(
					position.coords.latitude + "," + position.coords.longitude
				);
			});
		}
	}, []);
	
	const currentWeather = useMemo(async () => {
		// console.log('called')
		if (currentLocation === "") return;
		const weather = await fetchWeather(currentLocation);
		// console.log('called again: '+ currentLocation);
		// console.log(weather);

		return weather;
	}, [currentLocation]);

	useEffect(() => {console.log(currentWeather)});
	
	const handleClear = () => {
		setInputValue("");
		setSuggestions([]);
		console.log(currentWeather)
		func(currentWeather);
	};

	useEffect(() => {
		if (inputValue.length === 0) {
			currentWeather.then((data) => {
				func(data);
			});
			// console.log("Data set from memo: " + currentWeather);
		}

		const delayDebounceFn = setTimeout(() => {
			fetchSearch(inputValue);
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [inputValue, currentWeather]);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);

		const selectedSuggestion = suggestions.find(
			(suggestion) =>
				suggestion.name +
					", " +
					suggestion.region +
					", " +
					suggestion.country ===
				e.target.value
		);

		// console.log(e.target.value);
		// console.log(selectedSuggestion);

		if (selectedSuggestion) {
			// console.log('Selected suggestion: '+selectedSuggestion.name);
			const data = fetchWeather(e.target.value);
			// console.log(data);
			func(data);
		}
	};

	return (
		<div className="search">
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				placeholder="Type a location..."
				list="suggestions"
			/>

			<button onClick={handleClear}>X</button>

			{suggestions.length > 0 && (
				<datalist id="suggestions">
					{suggestions.map((suggestion) => (
						<option
							key={suggestion.id}
							value={`${suggestion.name}, ${suggestion.region}, ${suggestion.country}`}
						/>
					))}
				</datalist>
			)}
		</div>
	);
};

export default SearchBarComponent;

// {
//     "id": 1110805,
//     "name": "Chennai",
//     "region": "Tamil Nadu",
//     "country": "India",
//     "lat": 13.08,
//     "lon": 80.28,
//     "url": "chennai-tamil-nadu-india"
// }
