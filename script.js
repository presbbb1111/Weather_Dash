const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const currentDiv = document.getElementById("current");
const forecastDiv = document.getElementById("forecast");
const recentDiv = document.getElementById("recent");
const unitBtn = document.getElementById("unit-btn");

let unit = "fahrenheit";
let lastCity = "";
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// weather codes
function getDescription(code) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

async function getWeather(city) {
  message.textContent = "Loading...";

  try {
    // the forecast api needs coordinates so look up the city first
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      message.textContent = `Couldn't find "${city}"`;
      currentDiv.innerHTML = "";
      forecastDiv.innerHTML = "";
      return;
    }

    const place = geoData.results[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current=temperature_2m,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
      `&temperature_unit=${unit}&wind_speed_unit=mph&timezone=auto`;

    const weatherRes = await fetch(url);
    const data = await weatherRes.json();

    message.textContent = "";
    lastCity = place.name;
    showCurrent(place, data);
    showForecast(data);
    addRecent(place.name);
  } catch (err) {
    console.log(err);
    message.textContent = "Something went wrong, check your connection and try again";
  }
}

function showCurrent(place, data) {
  const symbol = unit === "fahrenheit" ? "°F" : "°C";
  const current = data.current;

  let locationName = place.name;
  if (place.admin1) {
    locationName += ", " + place.admin1;
  }

  currentDiv.innerHTML = `
    <h2 id="location"></h2>
    <p class="temp">${Math.round(current.temperature_2m)}${symbol}</p>
    <p>${getDescription(current.weather_code)}</p>
    <p>Wind: ${Math.round(current.wind_speed_10m)} mph</p>
  `;
  // textContent so a weird city name can't add html to the page
  document.getElementById("location").textContent = locationName;
}

function showForecast(data) {
  const daily = data.daily;
  forecastDiv.innerHTML = "";

  for (let i = 0; i < daily.time.length; i++) {
    
    const date = new Date(daily.time[i] + "T00:00");
    let dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    if (i === 0) dayName = "Today";

    const card = document.createElement("div");
    card.className = "day";
    card.innerHTML = `
      <h3>${dayName}</h3>
      <p>${getDescription(daily.weather_code[i])}</p>
      <p><strong>${Math.round(daily.temperature_2m_max[i])}°</strong> / ${Math.round(daily.temperature_2m_min[i])}°</p>
    `;
    forecastDiv.appendChild(card);
  }
}

function addRecent(city) {
  
  recentCities = recentCities.filter(c => c !== city);
  recentCities.unshift(city);
  recentCities = recentCities.slice(0, 5);

  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  showRecent();
}

function showRecent() {
  recentDiv.innerHTML = "";

  for (const city of recentCities) {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.addEventListener("click", () => {
      cityInput.value = city;
      getWeather(city);
    });
    recentDiv.appendChild(btn);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city === "") return;
  getWeather(city);
});

unitBtn.addEventListener("click", () => {
  if (unit === "fahrenheit") {
    unit = "celsius";
    unitBtn.textContent = "Switch to °F";
  } else {
    unit = "fahrenheit";
    unitBtn.textContent = "Switch to °C";
  }

  if (lastCity !== "") {
    getWeather(lastCity);
  }
});

showRecent();


if (recentCities.length > 0) {
  getWeather(recentCities[0]);
}
