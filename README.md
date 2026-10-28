# weather-dashboard

A weather site where you search a city and get the current weather and a 7 day forecast. I built it with plain HTML, CSS, and JavaScript (no frameworks) to get better at JavaScript before moving on to React.

Live site: https://YOURUSERNAME.github.io/weather-dashboard/

## Features

- search any city
- current temperature, conditions, and wind
- 7 day forecast with highs and lows
- switch between °F and °C
- saves your last 5 searches and loads the last one when you come back
- works on phones

## How it works

The weather data comes from [Open-Meteo](https://open-meteo.com/), which is free and doesn't need an API key. It takes two requests: the geocoding API turns the city name into latitude and longitude, then the forecast API uses those to get the weather. Both use `fetch` with async/await, and there's a try/catch so the page shows a message instead of breaking if something fails.

Open-Meteo sends the conditions as a number code, so `getDescription()` turns it into words like "Rain" or "Clear". Recent searches are saved in localStorage.

## Running it

Nothing to install. Download it and open `index.html` in a browser. I used the Live Server extension in VS Code so the page reloads every time I save.

## Stuff I want to add

- weather icons
- use your location to show local weather
- hourly forecast for today
