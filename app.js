function updateTime() {
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
  let seconds = currentTime.getSeconds();
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  let dayIndex = currentTime.getDay();
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
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
  let daytimeColors = "linear-gradient(to bottom, #DBE9FA, #87CEFA)";
  let nighttimeColors = "linear-gradient(to bottom, #00458e, #000328)";
  let daytimeText = "#000";
  let nighttimeText = "#fff";
  let dayBorderColor = "#000";
  let nightBorderColor = "#fff";
  let dayColor = "#000";
  let nightColor = "#fff";

  let isDaytime;
  if (hours >= 6 && hours < 16) {
    isDaytime = true;
  } else {
    isDaytime = false;
  }

  let container = document.querySelector(".container");
  if (isDaytime) {
    container.style.background = daytimeColors;
    container.style.color = daytimeText;
  } else {
    container.style.background = nighttimeColors;
    container.style.color = nighttimeText;
  }

  let input = document.querySelector("#city-input");
  if (isDaytime) {
    input.classList.add("placeholder-day");
    input.classList.remove("placeholder-night");
  } else {
    input.classList.add("placeholder-night");
    input.classList.remove("placeholder-day");
  }

  let searchButton = document.querySelector(".search");
  if (isDaytime) {
    searchButton.style.color = daytimeText;
  } else {
    searchButton.style.color = nighttimeText;
  }

  let locationIcon = document.querySelector(".location");
  if (isDaytime) {
    locationIcon.style.color = dayColor;
  } else {
    locationIcon.style.color = nightColor;
  }

  let githubIcon = document.querySelector(".icon");
  if (isDaytime) {
    githubIcon.style.color = dayColor;
  } else {
    githubIcon.style.color = nightColor;
  }

  let cardWeatherElements = document.querySelectorAll(".card-weather");

  cardWeatherElements.forEach((card) => {
    if (isDaytime) {
      card.style.borderColor = dayBorderColor;
    } else {
      card.style.borderColor = nightBorderColor;
    }
  });

  function addSuffixToDay(day) {
    if (day % 10 === 1 && day !== 11) {
      return day + "st";
    } else if (day % 10 === 2 && day !== 12) {
      return day + "nd";
    } else if (day % 10 === 3 && day !== 13) {
      return day + "rd";
    } else {
      return day + "th";
    }
  }

  let dayWithSuffix = addSuffixToDay(date);

  dateElement.innerHTML = `${hours}:${minutes}:${seconds} ${days[dayIndex]} ${months[monthIndex]} ${dayWithSuffix}, ${year}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function showWeather(response) {
  let temp = Math.round(response.data.main.temp);
  document.querySelector(".degrees").innerHTML = `${temp}`;
  document.querySelector(".city").innerHTML = response.data.name;

  let description = document.querySelector(".description");
  document.querySelector(".description").innerHTML =
    response.data.weather[0].description;

  let minTemp = document.querySelector(".min");
  let maxTemp = document.querySelector(".max");
  minTemp.innerHTML = Math.round(response.data.main.temp_min) + `ºC`;
  maxTemp.innerHTML = Math.round(response.data.main.temp_max) + `ºC`;

  let humidity = document.querySelector(".humidity");
  humidity.innerHTML = response.data.main.humidity + "%";

  let windSpeed = document.querySelector(".wind");
  windSpeed.innerHTML = response.data.wind.speed + " m/s";

  let pressure = document.querySelector(".pressure");
  pressure.innerHTML = response.data.main.pressure + " hPa";

  let weatherIconCode = response.data.weather[0].icon;

  let iconMapping = {
    "01d": "clear-day.svg",
    "01n": "clear-night.svg",
    "02d": "cloudy.svg",
    "02n": "partly-cloudy-night.svg",
    "03d": "partly-cloudy-day.svg",
    "03n": "partly-cloudy-night.svg",
    "04d": "overcast.svg",
    "04n": "overcast.svg",
    "09d": "overcast-rain.svg",
    "09n": "overcast-rain.svg",
    "10d": "overcast-day-rain.svg",
    "10n": "overcast-night-rain.svg",
    "11d": "thunderstorms-day.svg",
    "11n": "thunderstorms-night.svg",
    "13d": "snow.svg",
    "13n": "snow.svg",
    "50d": "mist.svg",
    "50n": "mist.svg",
  };

  let iconFileName = iconMapping[weatherIconCode];

  let icon = document.querySelector(".weather-icon");
  icon.setAttribute("src", `img/${iconFileName}`);
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

function showForecast(response) {
  console.log(response);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".box-4");

  let forecastIconMapping = {
    "01d": "clear-day.svg",
    "01n": "clear-night.svg",
    "02d": "cloudy.svg",
    "02n": "partly-cloudy-night.svg",
    "03d": "partly-cloudy-day.svg",
    "03n": "partly-cloudy-night.svg",
    "04d": "overcast.svg",
    "04n": "overcast.svg",
    "09d": "overcast-rain.svg",
    "09n": "overcast-rain.svg",
    "10d": "overcast-day-rain.svg",
    "10n": "overcast-night-rain.svg",
    "11d": "thunderstorms-day.svg",
    "11n": "thunderstorms-night.svg",
    "13d": "snow.svg",
    "13n": "snow.svg",
    "50d": "mist.svg",
    "50n": "mist.svg",
  };

  let forecastHTML = `<div class="rectangle">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let weatherCondition = forecastDay.weather[0].icon;
      let customForecastIcon = forecastIconMapping[weatherCondition];

      forecastHTML =
        forecastHTML +
        ` <div class="card-weather">
            <h2 class="today">${formatDay(forecastDay.dt)}</h2>
            <img src="img/${customForecastIcon}" alt="" class="forecast-icon"/>
            <p class="temperatures">${Math.round(
              forecastDay.temp.max
            )}&deg; ${Math.round(forecastDay.temp.min)}&deg;</p>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let api = "93d43dfe3b4a950e5b187e5dc313705e";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${api}&units=metric`;
  console.log(url);
  axios.get(url).then(showForecast);
  console.log(url);
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
setInterval(updateTime, 1000);
