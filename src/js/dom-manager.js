import { getFormattedDate, getWeekDay, convertTo12HourClock } from './date-hour-manager.js';
import {
  getCelsiusFromFahrenheit,
  getMilimitersFromInches,
  getKphFromMph,
} from './unit-conversion.js';
import {
  getHumidityFeedback,
  getPrecipLevelFeedback,
  getPrecipProbFeedback,
  getPressureFeedback,
  getUvIndexFeedback,
  getWindDirectionFeedback,
  getWindSpeedFeedback,
} from './weather-feedback.js';
import umbrellaIcon from '../assets/icons/umbrella-icon.svg';

/* Variables */

const backgroundGradients = {
  snow: 'linear-gradient(rgba(136, 148, 167, 0.75) 0 0)',
  rain: 'linear-gradient(rgba(120, 140, 173, 0.25) 0 0)',
  fog: 'linear-gradient(rgba(108, 120, 138, 0.25) 0 0)',
  wind: 'linear-gradient(rgba(83, 101, 126, 0.5) 0 0)',
  cloudy: 'linear-gradient(rgba(85, 99, 117, 0.5) 0 0)',
  'partly-cloudy-day': 'linear-gradient(rgba(146, 180, 201, 0.5) 0 0)',
  'partly-cloudy-night': 'linear-gradient(rgba(78, 91, 124, 0.3) 0 0)',
  'clear-night': 'linear-gradient(rgba(78, 91, 124, 0.25) 0 0)',
  'clear-day': 'linear-gradient(rgba(146, 180, 201, 0.2) 0 0)',
};
let usingCelsius = false;
let usingMetric = false;
let currentTemperatureUnit = '°F';
let currentPrecipitationUnit = 'in';
let currentWindSpeedUnit = 'mph';

/* Auxiliar functions */

function getConvertedTemperature(temperature) {
  return usingCelsius ? Math.round(getCelsiusFromFahrenheit(temperature)) : temperature;
}

function getConvertedPrecipitation(precipitation) {
  return usingMetric ? Math.round(getMilimitersFromInches(precipitation)) : precipitation;
}

function getConvertedWindSpeed(windSpeed) {
  return usingMetric ? getKphFromMph(windSpeed).toFixed(1) : windSpeed;
}

/* Forms */

export function getQueryFormData() {
  const form = document.querySelector('#query-form');
  const formData = new FormData(form);
  const query = formData.get('query');
  form.reset();
  return query;
}

export function getSubmitQueryFormButton() {
  return document.querySelector('#query-form button[type="submit"]');
}

/* Update sections */

export function updateLocationInfo(weatherData) {
  const locationInfo = document.querySelector('#location-info');
  locationInfo.querySelector('.current-location span').innerText = weatherData.location;
  locationInfo.querySelector('.current-location span').title = weatherData.location;
}

export function updateMainInfo(weatherData) {
  const mainInfo = document.querySelector('#main-info');
  mainInfo.querySelector('.temperature .value').innerText = getConvertedTemperature(
    weatherData.currentConditions.temp,
  );

  mainInfo.querySelector('.icon').alt = weatherData.currentConditions.icon;
  import(`../assets/icons/${weatherData.currentConditions.icon}-icon.png`).then((icon) => {
    mainInfo.querySelector('.icon').src = icon.default;
  });

  mainInfo.querySelector('.temperature .temperature-unit').innerText = currentTemperatureUnit;
  mainInfo.querySelector('.date').innerText = getFormattedDate(weatherData.days[0].date);

  mainInfo.querySelector('.feels-like .value').innerText = getConvertedTemperature(
    weatherData.currentConditions.feelsLike,
  );
  mainInfo.querySelector('.feels-like .temperature-unit').innerText = currentTemperatureUnit;
  mainInfo.querySelector('.conditions').innerText = weatherData.currentConditions.conditions;
  mainInfo.querySelector('.conditions').title = weatherData.currentConditions.conditions;
}

export function updateDaysForecastCard(weatherData) {
  const dayForecastContent = document.querySelector('#day-forecast .content');
  const description = document.createElement('div');

  dayForecastContent.innerHTML = '';

  description.classList.add('description');
  description.innerHTML = weatherData.description;
  description.title = weatherData.description;
  dayForecastContent.appendChild(description);

  let index = 0;
  for (const day of weatherData.days) {
    const dateDiv = document.createElement('div');
    const weatherIconImg = document.createElement('img');
    const tempMinDiv = document.createElement('div');
    const tempMaxDiv = document.createElement('div');

    dateDiv.classList.add('date');
    dateDiv.innerText = index === 0 ? 'Today' : getWeekDay(day.date);

    weatherIconImg.classList.add('icon');
    weatherIconImg.alt = day.icon;
    import(`../assets/icons/${day.icon}-icon.png`).then((icon) => {
      weatherIconImg.src = icon.default;
    });

    tempMinDiv.classList.add('temp-min');
    tempMinDiv.innerHTML = `Min: <span class="value">${getConvertedTemperature(day.tempMin)}</span><span class="temperature-unit">${currentTemperatureUnit}</span>`;

    tempMaxDiv.classList.add('temp-max');
    tempMaxDiv.innerHTML = `Max: <span class="value">${getConvertedTemperature(day.tempMax)}</span><span class="temperature-unit">${currentTemperatureUnit}</span>`;

    dayForecastContent.appendChild(dateDiv);
    dayForecastContent.appendChild(weatherIconImg);
    dayForecastContent.appendChild(tempMinDiv);
    dayForecastContent.appendChild(tempMaxDiv);
    index++;
  }
}

export function updateHourlyForecastCard(weatherData) {
  const hourlyForecastContent = document.querySelector('#hourly-forecast .content');
  hourlyForecastContent.querySelector('.min-max').innerHTML =
    ' Min: ' +
    `<span class="value">${getConvertedTemperature(weatherData.days[0].tempMin)}</span>` +
    `<span class="temperature-unit">${currentTemperatureUnit}</span>` +
    ' — Max: ' +
    `<span class="value">${getConvertedTemperature(weatherData.days[0].tempMax)}</span>` +
    `<span class="temperature-unit">${currentTemperatureUnit}</span>`;

  hourlyForecastContent.querySelector('.hours').innerHTML = '';

  let index = 0;
  const next24HoursData = weatherData.getNext24HoursData();
  for (const hour of next24HoursData) {
    const timeDiv = document.createElement('div');
    const weatherIconImg = document.createElement('img');
    const umbrellaIconImg = document.createElement('img');
    const precipProbDiv = document.createElement('div');
    const tempDiv = document.createElement('div');
    const time = convertTo12HourClock(hour.time);

    timeDiv.classList.add('time');
    timeDiv.innerHTML =
      index === 0 ? 'Now' : `<span>${time.hours}</span><span>${time.period}</span>`;

    weatherIconImg.classList.add('icon');
    weatherIconImg.alt = hour.icon;
    import(`../assets/icons/${hour.icon}-icon.png`).then((icon) => {
      weatherIconImg.src = icon.default;
    });

    const wrapperDiv = document.createElement('div');
    umbrellaIconImg.alt = 'Precipitation chance';
    umbrellaIconImg.src = umbrellaIcon;

    precipProbDiv.classList.add('precip-prob');
    precipProbDiv.innerHTML = `<span>${hour.precipProb}</span>%`;

    wrapperDiv.classList.add('wrapper');
    wrapperDiv.appendChild(umbrellaIconImg);
    wrapperDiv.appendChild(precipProbDiv);

    tempDiv.classList.add('temperature');
    tempDiv.innerHTML = `<span class="value">${getConvertedTemperature(hour.temp)}</span><span class="temperature-unit">${currentTemperatureUnit}</span>`;

    hourlyForecastContent.querySelector('.hours').appendChild(timeDiv);
    hourlyForecastContent.querySelector('.hours').appendChild(weatherIconImg);
    hourlyForecastContent.querySelector('.hours').appendChild(wrapperDiv);
    hourlyForecastContent.querySelector('.hours').appendChild(tempDiv);
    index++;
  }
}

export function updatePrecipitationCard(weatherData) {
  const precipitationCard = document.querySelector('#precipitation');
  precipitationCard.querySelector('.precip-level .value').innerText = getConvertedPrecipitation(
    weatherData.currentConditions.precip,
  );
  precipitationCard.querySelector('.precip-level .precipitation-unit').innerText =
    currentPrecipitationUnit;
  precipitationCard.querySelector('.precip-level .feedback').innerText = getPrecipLevelFeedback(
    weatherData.currentConditions.precip,
  );
  precipitationCard.querySelector('.precip-prob .value').innerText =
    weatherData.currentConditions.precipProb;
  precipitationCard.querySelector('.precip-prob .feedback').innerText = getPrecipProbFeedback(
    weatherData.currentConditions.precipProb,
  );
}

export function updateHumidityCard(weatherData) {
  const humidityCard = document.querySelector('#humidity');
  humidityCard.querySelector('.air-humidity span').innerText =
    weatherData.currentConditions.humidity;
  humidityCard.querySelector('.feedback').innerText = getHumidityFeedback(
    weatherData.currentConditions.humidity,
  );
}

export function updateSunriseSunsetCard(weatherData) {
  const sunriseSunsetCard = document.querySelector('#sunrise-sunset');
  const sunriseTime = convertTo12HourClock(weatherData.currentConditions.sunrise);
  const sunsetTime = convertTo12HourClock(weatherData.currentConditions.sunset);
  sunriseSunsetCard.querySelector('.sunrise-time .value').innerHTML =
    `<span>${sunriseTime.hours}:${sunriseTime.minutes}</span> <span>${sunriseTime.period}</span>`;
  sunriseSunsetCard.querySelector('.sunset-time .value').innerHTML =
    `<span>${sunsetTime.hours}:${sunsetTime.minutes}</span> <span>${sunsetTime.period}</span>`;
}

export function updatePressureCard(weatherData) {
  const pressureCard = document.querySelector('#pressure');
  pressureCard.querySelector('.air-pressure span').innerText =
    weatherData.currentConditions.pressure;
  pressureCard.querySelector('.feedback').innerText = getPressureFeedback(
    weatherData.currentConditions.pressure,
  );
}

export function updateWindCard(weatherData) {
  const windCard = document.querySelector('#wind');
  windCard.querySelector('.wind-speed .value').innerText = getConvertedWindSpeed(
    weatherData.currentConditions.windSpeed,
  );
  windCard.querySelector('.wind-speed .wind-speed-unit').innerText = currentWindSpeedUnit;
  windCard.querySelector('.wind-speed + .feedback').innerText = getWindSpeedFeedback(
    weatherData.currentConditions.windSpeed,
  );
  windCard.querySelector('.wind-direction span').innerText =
    weatherData.currentConditions.windDir + '°';
  windCard.querySelector('.wind-direction .feedback').innerText =
    `(${getWindDirectionFeedback(weatherData.currentConditions.windDir)})`;
  windCard.querySelector('#arrow-icon').style.transform =
    `rotate(${weatherData.currentConditions.windDir}deg)`;
}

export function updateUvIndexCard(weatherData) {
  const uvIndexCard = document.querySelector('#uv-index');
  const uvIndexFeedback = getUvIndexFeedback(weatherData.currentConditions.uvIndex);

  uvIndexCard.querySelector('.value').innerText = weatherData.currentConditions.uvIndex;
  uvIndexCard.querySelector('.feedback').innerText = uvIndexFeedback.text;
  uvIndexCard.querySelector('.meter .bar').style.width =
    `calc(${uvIndexFeedback.barWidthProportion} * 10px)`;
  uvIndexCard.querySelector('.meter .bar').style.backgroundColor = uvIndexFeedback.color;
}

export function updateBackground(weatherData) {
  const body = document.querySelector('body');
  const gradient = backgroundGradients[weatherData.currentConditions.icon];

  import(`../assets/imgs/${weatherData.currentConditions.icon}-background.jpg`).then(
    (backgroundImage) => {
      body.style.backgroundImage = `${gradient}, url(${backgroundImage.default})`;
    },
  );
}

export function updateAllSections(weatherData) {
  updateLocationInfo(weatherData);
  updateMainInfo(weatherData);
  updateDaysForecastCard(weatherData);
  updateHourlyForecastCard(weatherData);
  updatePrecipitationCard(weatherData);
  updateHumidityCard(weatherData);
  updateSunriseSunsetCard(weatherData);
  updatePressureCard(weatherData);
  updateWindCard(weatherData);
  updateUvIndexCard(weatherData);
}

/* Change current measurement units */

export function switchToFahrenheit() {
  if (!usingCelsius) return;
  usingCelsius = false;
  currentTemperatureUnit = '°F';
}

export function switchToCelsius() {
  if (usingCelsius) return;
  usingCelsius = true;
  currentTemperatureUnit = '°C';
}

export function switchToImperial() {
  if (!usingMetric) return;
  usingMetric = false;
  currentPrecipitationUnit = 'in';
  currentWindSpeedUnit = 'mph';
}

export function switchToMetric() {
  if (usingMetric) return;
  usingMetric = true;
  currentPrecipitationUnit = 'mm';
  currentWindSpeedUnit = 'km/h';
}

/* Initialize event listeners */

export function initializeSettingsEventListeners(getCurrentWeatherData) {
  const fahrenheitButton = document.querySelector('#fahrenheit-btn');
  const celsiusButton = document.querySelector('#celsius-btn');
  const metricButton = document.querySelector('#metric-btn');
  const imperialButton = document.querySelector('#imperial-btn');

  fahrenheitButton.addEventListener('click', () => {
    fahrenheitButton.setAttribute('selected', true);
    celsiusButton.removeAttribute('selected');
    switchToFahrenheit();
    updateAllSections(getCurrentWeatherData());
  });

  celsiusButton.addEventListener('click', () => {
    celsiusButton.setAttribute('selected', true);
    fahrenheitButton.removeAttribute('selected');
    switchToCelsius();
    updateAllSections(getCurrentWeatherData());
  });

  imperialButton.addEventListener('click', () => {
    imperialButton.setAttribute('selected', true);
    metricButton.removeAttribute('selected');
    switchToImperial();
    updateAllSections(getCurrentWeatherData());
  });

  metricButton.addEventListener('click', () => {
    metricButton.setAttribute('selected', true);
    imperialButton.removeAttribute('selected');
    switchToMetric();
    updateAllSections(getCurrentWeatherData());
  });
}

/* Display/hide feedback fields */

export function displayLoadingComponent() {
  const loadingComponent = document.querySelector('#location-info .loading');
  loadingComponent.innerHTML = 'Loading&#8230;';
}

export function hideLoadingComponent() {
  const loadingComponent = document.querySelector('#location-info .loading');
  loadingComponent.innerHTML = '';
}

export function showQueryErrorMessage(errorMessage) {
  const errorField = document.querySelector('#location-info .error');
  errorField.innerText = errorMessage;
}

export function hideQueryErrorMessage() {
  const errorField = document.querySelector('#location-info .error');
  errorField.innerText = '';
}
