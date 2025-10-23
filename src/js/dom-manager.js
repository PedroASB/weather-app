export function getQueryFormData() {
  const form = document.querySelector('#query-form');
  const formData = new FormData(form);
  const query = formData.get('query');
  form.reset();
  return query;
}

export function getUnitsFormData() {
  const form = document.querySelector('#units-form');
  const formData = new FormData(form);
  const temperatureUnit = formData.get('temperature-unit');
  const distanceUnit = formData.get('distance-unit');
  form.reset();
  return { temperatureUnit, distanceUnit };
}

export function updateMainInfo(data) {
  const mainInfo = document.querySelector('#main-info');
  mainInfo.querySelector('.temperature span').innerText = data.currentConditions.temp;
  mainInfo.querySelector('.location span').innerText = data.location;
  mainInfo.querySelector('.feels-like span').innerText = data.currentConditions.feelsLike;
  mainInfo.querySelector('.conditions span').innerText = data.currentConditions.conditions;
}

export function updateDaysForecastCard(data) {
  const dayForecastContent = document.querySelector('#day-forecast .content');
  dayForecastContent.innerHTML = '';

  for (const day of data.days) {
    const dateDiv = document.createElement('div');
    const iconDiv = document.createElement('div');
    const tempMinDiv = document.createElement('div');
    const tempMaxDiv = document.createElement('div');

    dateDiv.classList.add('date');
    dateDiv.innerText = day.date;

    iconDiv.classList.add('icon');
    iconDiv.innerText = '[icon]'; // temporary

    tempMinDiv.classList.add('temp-min');
    tempMinDiv.innerHTML = `Min: <span>${day.tempMin}</span>°F`;

    tempMaxDiv.classList.add('temp-max');
    tempMaxDiv.innerHTML = `Max: <span>${day.tempMax}</span>°F`;

    dayForecastContent.appendChild(dateDiv);
    dayForecastContent.appendChild(iconDiv);
    dayForecastContent.appendChild(tempMinDiv);
    dayForecastContent.appendChild(tempMaxDiv);
  }
}

export function updateHourlyForecastCard(data) {
  const hourlyForecastContent = document.querySelector('#hourly-forecast .content');
  hourlyForecastContent.querySelector('.description').innerText = 'Today: ' + data.description;
  hourlyForecastContent.querySelector('.hours').innerHTML = '';

  for (const hour of data.currentDay.hours) {
    const timeDiv = document.createElement('div');
    const iconDiv = document.createElement('div');
    const precipProbDiv = document.createElement('div');
    const tempDiv = document.createElement('div');

    timeDiv.classList.add('time');
    timeDiv.innerText = hour.time;

    iconDiv.classList.add('icon');
    iconDiv.innerText = '[icon]'; // temporary

    precipProbDiv.classList.add('precip-prob');
    precipProbDiv.innerHTML = `<span>${hour.precipProb}</span>%`;

    tempDiv.classList.add('temperature');
    tempDiv.innerHTML = `<span>${hour.temp}</span>°F`;

    hourlyForecastContent.querySelector('.hours').appendChild(timeDiv);
    hourlyForecastContent.querySelector('.hours').appendChild(iconDiv);
    hourlyForecastContent.querySelector('.hours').appendChild(precipProbDiv);
    hourlyForecastContent.querySelector('.hours').appendChild(tempDiv);
  }
}

export function updatePrecipitationCard(data) {
  const precipitationCard = document.querySelector('#precipitation');
  precipitationCard.querySelector('.precip-level span').innerText = data.currentConditions.precip;
  precipitationCard.querySelector('.precip-prob span').innerText =
    data.currentConditions.precipProb;
}

export function updateHumidityCard(data) {
  const humidityCard = document.querySelector('#humidity');
  humidityCard.querySelector('.air-humidity span').innerText = data.currentConditions.humidity;
}

export function updateSunriseSunsetCard(data) {
  const sunriseSunsetCard = document.querySelector('#sunrise-sunset');
  sunriseSunsetCard.querySelector('.sunrise-time span').innerText = data.currentConditions.sunrise;
  sunriseSunsetCard.querySelector('.sunset-time span').innerText = data.currentConditions.sunset;
}

export function updatePressureCard(data) {
  const pressureCard = document.querySelector('#pressure');
  pressureCard.querySelector('.air-pressure span').innerText = data.currentConditions.pressure;
}

export function updateWindCard(data) {
  const windCard = document.querySelector('#wind');
  windCard.querySelector('.wind-speed span').innerText = data.currentConditions.windSpeed;
  windCard.querySelector('.wind-direction span').innerText = data.currentConditions.windDir;
}

export function updateUvIndexCard(data) {
  const uvIndexCard = document.querySelector('#uv-index');
  uvIndexCard.querySelector('.uv-index span').innerText = data.currentConditions.uvIndex;
}

export function updateAllSections(data) {
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
