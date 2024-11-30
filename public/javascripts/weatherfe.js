// Mapping van weerscodes naar beschrijvingen in het Nederlands
const weatherDescriptions = {
  0: "Onbewolkt",
  1: "Overwegend helder",
  2: "Gedeeltelijk bewolkt",
  3: "Bewolkt",
  45: "Mist",
  48: "Aanzettende rijp mist",
  51: "Motregen: Lichte intensiteit",
  53: "Motregen: Matige intensiteit",
  55: "Motregen: Zware intensiteit",
  56: "Ijzel: Lichte intensiteit",
  57: "Ijzel: Zware intensiteit",
  61: "Regen: Lichte intensiteit",
  63: "Regen: Matige intensiteit",
  65: "Regen: Zware intensiteit",
  66: "Ijzelregen: Lichte intensiteit",
  67: "Ijzelregen: Zware intensiteit",
  71: "Sneeuwval: Lichte intensiteit",
  73: "Sneeuwval: Matige intensiteit",
  75: "Sneeuwval: Zware intensiteit",
  77: "Sneeuwkorrels",
  80: "Regenbuien: Lichte intensiteit",
  81: "Regenbuien: Matige intensiteit",
  82: "Regenbuien: Hevige intensiteit",
  85: "Sneeuwbuien: Lichte intensiteit",
  86: "Sneeuwbuien: Zware intensiteit",
  95: "Onweer: Licht of matig",
  96: "Onweer met lichte hagel",
  99: "Onweer met zware hagel"
};

// Mapping van weerscodes naar Weather Icons-klassen
const weatherIcons = {
  0: "wi-day-sunny",
  1: "wi-day-cloudy",
  2: "wi-cloud",
  3: "wi-cloudy",
  45: "wi-fog",
  48: "wi-fog",
  51: "wi-sprinkle",
  53: "wi-sprinkle",
  55: "wi-rain",
  56: "wi-sleet",
  57: "wi-sleet",
  61: "wi-showers",
  63: "wi-rain",
  65: "wi-rain",
  66: "wi-sleet",
  67: "wi-sleet",
  71: "wi-snow",
  73: "wi-snow",
  75: "wi-snow",
  77: "wi-snowflake-cold",
  80: "wi-showers",
  81: "wi-storm-showers",
  82: "wi-thunderstorm",
  85: "wi-snow",
  86: "wi-snow",
  95: "wi-thunderstorm",
  96: "wi-thunderstorm",
  99: "wi-thunderstorm"
};

// Functie om weerscodes naar beschrijvingen te vertalen
function getWeatherDescription(code) {
  return weatherDescriptions[code] || "Onbekende weersomstandigheid"; // Fallback voor onbekende codes
}

// Functie om de juiste Weather Icons-klasse te krijgen
function getWeatherIcon(code) {
  return weatherIcons[code] || "wi-na"; // Fallback voor onbekende codes
}

// API-url met jouw gewenste parameters
const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=50.8511&longitude=2.8857&current=temperature_2m,apparent_temperature,is_day,rain,showers,snowfall&hourly=temperature_2m,precipitation,rain,showers,snowfall,snow_depth,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=3";

// Functie om de dagen te benoemen
function getDayName(index) {
  const days = ["Vandaag", "Morgen", "Overmorgen"];
  return days[index] || `Dag ${index + 1}`;
}

// Functie om weerdata op te halen en weer te geven
function fetchWeatherData() {
  const weatherDiv = document.getElementById("weather");

  fetch(apiUrl)
      .then((response) => {
          if (!response.ok) throw new Error("Probleem met ophalen van gegevens");
          return response.json();
      })
      .then((data) => {
          // Huidige weerinformatie
          const currentWeather = `
              <div>
                  <h2>Huidig Weer:</h2>
                  <p>Temperatuur: ${data.current.temperature_2m}°C</p>
                  <p>Gevoelstemperatuur: ${data.current.apparent_temperature}°C</p>
                  <p>Regen: ${data.current.rain || 0} mm</p>
                  
              </div>
          `;

          // Dagelijkse weersvoorspelling
          const dailyWeatherCodes = data.daily.weather_code;
          const weatherHTML = dailyWeatherCodes
              .map((code, index) => {
                  const maxTemp = data.daily.temperature_2m_max[index];
                  const minTemp = data.daily.temperature_2m_min[index];
                  const precipitation = data.daily.precipitation_sum[index];

                  return `
                      <li>
                          <strong>${getDayName(index)}:</strong>
                          <span>${getWeatherDescription(code)}</span>
                          <i class="wi ${getWeatherIcon(code)}"></i>
                          <span>Max Temp: ${maxTemp}°C</span>
                          <span>Min Temp: ${minTemp}°C</span>
                          <span>Neerslag: ${precipitation} mm</span>
                      </li>
                  `;
              })
              .join("");

          // Voeg de HTML toe aan de container
          weatherDiv.innerHTML = `
              <div class="weather-container">
                  ${currentWeather}
                  <h2>Dagelijkse Weersvoorspelling</h2>
                  <ul>${weatherHTML}</ul>
              </div>
          `;
      })
      .catch((error) => {
          // Toon een foutmelding
          weatherDiv.innerHTML = `
              <div class="weather-container">
                  <p>Error: ${error.message}</p>
              </div>
          `;
      });
}

// Roep de functie aan zodra de pagina is geladen
document.addEventListener("DOMContentLoaded", fetchWeatherData);
