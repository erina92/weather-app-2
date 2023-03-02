let dateElement = document.querySelector(".date-time");
let currentTime = new Date();
let hours = currentTime.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = currentTime.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let dayIndex = currentTime.getDay();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let monthIndex = currentTime.getMonth();
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let year = currentTime.getFullYear();
let date = currentTime.getDate();

dateElement.innerHTML = `${hours}:${minutes} ${days[dayIndex]} ${months[monthIndex]} ${date} ${year}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showWeather(response) {
  let temp = Math.round(response.data.main.temp);
  document.querySelector(".degrees").innerHTML = `${temp}°C`;
  document.querySelector(".city").innerHTML = response.data.name;
  let description = document.querySelector(".description");
  document.querySelector(".description").innerHTML =
    response.data.weather[0].description;
  let minTemp = document.querySelector(".min");
  let maxTemp = document.querySelector(".max");
  minTemp.innerHTML = Math.round(response.data.main.temp_min) + `º`;
  maxTemp.innerHTML = Math.round(response.data.main.temp_max) + `º`;
  let humidity = document.querySelector(".humidity");
  humidity.innerHTML = response.data.main.humidity + "%";
  let windSpeed = document.querySelector(".wind");
  windSpeed.innerHTML = response.data.wind.speed + " m/s";
  let pressure = document.querySelector(".pressure");
  pressure.innerHTML = response.data.main.pressure + " hPa";
  let icon = document.querySelector(".weather-icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`
  );
  description.setAttribute("alt", response.data.weather.description);

  celsiusTemperature = response.data.main.temp;
  getForecast(response.data.coord);
}

function showCity(event) {
  event.preventDefault();
  let cityName = document.querySelector(".city");
  let cityInput = document.querySelector("#city-input");
  cityName.innerHTML = cityInput.value;
  let city = cityInput.value;
  let api = "03de31d04fb70d99511816e779098e29";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;

  console.log(url);

  axios.get(url).then(showWeather);
}

function showLocalWeather() {
  function getCurrentPosition(geolocation) {
    let latitude = geolocation.coords.latitude;
    let longitude = geolocation.coords.longitude;
    let api = "03de31d04fb70d99511816e779098e29";
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}&units=metric`;

    axios.get(url).then(showWeather);
  }
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

function getForecast(coordinates) {
  let api = "03de31d04fb70d99511816e779098e29";
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${api}&units=metric`;
  console.log(url);
  axios.get(url).then(showForecast);
  console.log(url);
}

function showForecast(response) {
  let forecast = response.data.daily;
  console.log(response);
  let forecastElement = document.querySelector(".box-4");

  let forecastHTML = `<div class="rectangle">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 4) {
      forecastHTML =
        forecastHTML +
        ` <div class="card-weather">
            <h2 class="today">${formatDay(forecastDay.dt)}</h2>
            <h3>${Math.round(forecastDay.main.temp)}&deg;C</h3>
            <img src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" />
            <p class="temperatures">${Math.round(
              forecastDay.temp.max
            )}&deg; ${Math.round(forecastDay.temp.min)}&deg;</p>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function FahrenheitTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector(".degrees");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemp);
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
}

function CelsiusTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector(".degrees");
  temperature.innerHTML = Math.round(celsiusTemperature);
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", showCity);

let currentCityButton = document.querySelector("#current-location");
currentCityButton.addEventListener("click", showLocalWeather);

let fahrenheit = document.querySelector(".fahrenheit");
fahrenheit.addEventListener("click", FahrenheitTemperature);

let celsius = document.querySelector(".celsius");
celsius.addEventListener("click", CelsiusTemperature);

showLocalWeather();
