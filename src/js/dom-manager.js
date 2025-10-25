import { getFormattedDate, getWeekDay, getTwelveHourTime } from './date-hour-manager.js';
import {
  getCelsiusFromFahrenheit,
  getMilimitersFromInches,
  getKphFromMph,
} from './unit-conversion.js';

// Icons
import snowIcon from '../assets/icons/snow-icon.png';
import rainIcon from '../assets/icons/rain-icon.png';
import fogIcon from '../assets/icons/fog-icon.png';
import windIcon from '../assets/icons/wind-icon.png';
import cloudyIcon from '../assets/icons/cloudy-icon.png';
import partlyCloudyDayIcon from '../assets/icons/partly-cloudy-day-icon.png';
import partlyCloudyNightIcon from '../assets/icons/partly-cloudy-night-icon.png';
import clearDayIcon from '../assets/icons/clear-day-icon.png';
import clearNightIcon from '../assets/icons/clear-night-icon.png';
import umbrellaIcon from '../assets/icons/umbrella-icon.svg';

const iconsMap = {
  snow: snowIcon,
  rain: rainIcon,
  fog: fogIcon,
  wind: windIcon,
  cloudy: cloudyIcon,
  'partly-cloudy-day': partlyCloudyDayIcon,
  'partly-cloudy-night': partlyCloudyNightIcon,
  'clear-day': clearDayIcon,
  'clear-night': clearNightIcon,
};

let usingCelsius = false;
let usingMetric = false;
let temperatureUnit = '°F';
let precipitationUnit = 'in';
let windSpeedUnit = 'mph';

function getConvertedTemperature(temperature) {
  return usingCelsius ? Math.round(getCelsiusFromFahrenheit(temperature)) : temperature;
}

function getConvertedPrecipitation(precipitation) {
  return usingMetric ? Math.round(getMilimitersFromInches(precipitation)) : precipitation;
}

function getConvertedWindSpeed(windSpeed) {
  return usingMetric ? getKphFromMph(windSpeed).toFixed(1) : windSpeed;
}

export function getQueryFormData() {
  const form = document.querySelector('#query-form');
  const formData = new FormData(form);
  const query = formData.get('query');
  form.reset();
  return query;
}

export function updateLocationInfo(data) {
  const locationInfo = document.querySelector('#location-info');
  locationInfo.querySelector('.current-location span').innerText = data.location;
}

export function updateMainInfo(data) {
  const mainInfo = document.querySelector('#main-info');
  mainInfo.querySelector('.temperature span.value').innerText = getConvertedTemperature(
    data.currentConditions.temp,
  );
  mainInfo.querySelector('.temperature span.temperature-unit').innerText = temperatureUnit;
  mainInfo.querySelector('.date').innerText = getFormattedDate(data.days[0].date);

  mainInfo.querySelector('.feels-like span.value').innerText = getConvertedTemperature(
    data.currentConditions.feelsLike,
  );
  mainInfo.querySelector('.feels-like span.temperature-unit').innerText = temperatureUnit;
  mainInfo.querySelector('.conditions').innerText = data.currentConditions.conditions;
}

export function updateDaysForecastCard(data) {
  const dayForecastContent = document.querySelector('#day-forecast .content');
  dayForecastContent.innerHTML = '';

  let index = 0;
  for (const day of data.days) {
    const dateDiv = document.createElement('div');
    const weatherIconImg = document.createElement('img');
    const tempMinDiv = document.createElement('div');
    const tempMaxDiv = document.createElement('div');

    dateDiv.classList.add('date');
    dateDiv.innerText = index === 0 ? 'Today' : getWeekDay(day.date);

    weatherIconImg.classList.add('icon');
    weatherIconImg.alt = day.icon;
    weatherIconImg.src = iconsMap[day.icon];

    tempMinDiv.classList.add('temp-min');
    tempMinDiv.innerHTML = `Min: <span>${getConvertedTemperature(day.tempMin)}</span><span class="temperature-unit">${temperatureUnit}</span>`;

    tempMaxDiv.classList.add('temp-max');
    tempMaxDiv.innerHTML = `Max: <span>${getConvertedTemperature(day.tempMax)}</span><span class="temperature-unit">${temperatureUnit}</span>`;

    dayForecastContent.appendChild(dateDiv);
    dayForecastContent.appendChild(weatherIconImg);
    dayForecastContent.appendChild(tempMinDiv);
    dayForecastContent.appendChild(tempMaxDiv);
    index++;
  }
}

export function updateHourlyForecastCard(data) {
  const hourlyForecastContent = document.querySelector('#hourly-forecast .content');
  hourlyForecastContent.querySelector('.description').innerHTML =
    'Today: ' +
    data.description +
    ' Min: ' +
    getConvertedTemperature(data.days[0].tempMin) +
    `<span class="temperature-unit">${temperatureUnit}</span>` +
    ' Max: ' +
    getConvertedTemperature(data.days[0].tempMax) +
    `<span class="temperature-unit">${temperatureUnit}</span>`;
  hourlyForecastContent.querySelector('.hours').innerHTML = '';

  for (const hour of data.currentDay.hours) {
    const timeDiv = document.createElement('div');
    const weatherIconImg = document.createElement('img');
    const umbrellaIconImg = document.createElement('img');
    const precipProbDiv = document.createElement('div');
    const tempDiv = document.createElement('div');
    const time = getTwelveHourTime(hour.time);

    timeDiv.classList.add('time');
    timeDiv.innerHTML =
      hour.time === data.currentConditions.time
        ? 'Now'
        : `<span>${time.hours}</span><span>${time.period}</span>`;

    weatherIconImg.classList.add('icon');
    weatherIconImg.alt = hour.icon;
    weatherIconImg.src = iconsMap[hour.icon];

    const wrapperDiv = document.createElement('div');
    umbrellaIconImg.alt = 'Precipitation chance';
    umbrellaIconImg.src = umbrellaIcon;

    precipProbDiv.classList.add('precip-prob');
    precipProbDiv.innerHTML = `<span>${hour.precipProb}</span>%`;

    wrapperDiv.classList.add('wrapper');
    wrapperDiv.appendChild(umbrellaIconImg);
    wrapperDiv.appendChild(precipProbDiv);

    tempDiv.classList.add('temperature');
    tempDiv.innerHTML = `<span>${getConvertedTemperature(hour.temp)}</span><span class="temperature-unit">${temperatureUnit}</span>`;

    hourlyForecastContent.querySelector('.hours').appendChild(timeDiv);
    hourlyForecastContent.querySelector('.hours').appendChild(weatherIconImg);
    // hourlyForecastContent.querySelector('.hours').appendChild(precipProbDiv);
    hourlyForecastContent.querySelector('.hours').appendChild(wrapperDiv);
    hourlyForecastContent.querySelector('.hours').appendChild(tempDiv);
  }
}

export function updatePrecipitationCard(data) {
  const precipitationCard = document.querySelector('#precipitation');
  precipitationCard.querySelector('.precip-level span.value').innerText = getConvertedPrecipitation(
    data.currentConditions.precip,
  );
  precipitationCard.querySelector('.precip-level span.precipitation-unit').innerText =
    precipitationUnit;
  precipitationCard.querySelector('.precip-prob span').innerText =
    data.currentConditions.precipProb;
}

export function updateHumidityCard(data) {
  const humidityCard = document.querySelector('#humidity');
  humidityCard.querySelector('.air-humidity span').innerText = data.currentConditions.humidity;
}

export function updateSunriseSunsetCard(data) {
  const sunriseSunsetCard = document.querySelector('#sunrise-sunset');
  const sunriseTime = getTwelveHourTime(data.currentConditions.sunrise);
  const sunsetTime = getTwelveHourTime(data.currentConditions.sunset);
  sunriseSunsetCard.querySelector('.sunrise-time span').innerHTML =
    `<span>${sunriseTime.hours}:${sunriseTime.minutes}</span><span>${sunriseTime.period}</span>`;
  sunriseSunsetCard.querySelector('.sunset-time span').innerHTML =
    `<span>${sunsetTime.hours}:${sunsetTime.minutes}</span><span>${sunsetTime.period}</span>`;
}

export function updatePressureCard(data) {
  const pressureCard = document.querySelector('#pressure');
  pressureCard.querySelector('.air-pressure span').innerText = data.currentConditions.pressure;
}

export function updateWindCard(data) {
  const windCard = document.querySelector('#wind');
  windCard.querySelector('.wind-speed span.value').innerText = getConvertedWindSpeed(
    data.currentConditions.windSpeed,
  );
  windCard.querySelector('.wind-speed span.wind-speed-unit').innerText = windSpeedUnit;
  windCard.querySelector('.wind-direction span').innerText = data.currentConditions.windDir;
}

export function updateUvIndexCard(data) {
  const uvIndexCard = document.querySelector('#uv-index');
  uvIndexCard.querySelector('.uv-index span').innerText = data.currentConditions.uvIndex;
}

export function updateAllSections(weatherData) {
  const data = weatherData.getData();
  updateLocationInfo(data);
  updateMainInfo(data);
  updateDaysForecastCard(data);
  updateHourlyForecastCard(data);
  updatePrecipitationCard(data);
  updateHumidityCard(data);
  updateSunriseSunsetCard(data);
  updatePressureCard(data);
  updateWindCard(data);
  updateUvIndexCard(data);
}

export function switchToFahrenheit(weatherData) {
  if (!usingCelsius) return;
  usingCelsius = false;
  temperatureUnit = '°F';
  updateAllSections(weatherData);
}

export function switchToCelsius(weatherData) {
  if (usingCelsius) return;
  usingCelsius = true;
  temperatureUnit = '°C';
  updateAllSections(weatherData);
}

export function switchToImperial(weatherData) {
  if (!usingMetric) return;
  usingMetric = false;
  precipitationUnit = 'in';
  windSpeedUnit = 'mph';
  updateAllSections(weatherData);
}

export function switchToMetric(weatherData) {
  if (usingMetric) return;
  usingMetric = true;
  precipitationUnit = 'mm';
  windSpeedUnit = 'km/h';
  updateAllSections(weatherData);
}
