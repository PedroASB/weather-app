import './css/reset.css';
import './css/style.css';
import * as weatherApi from './js/weather-api.js';
import * as domManager from './js/dom-manager.js';

function updateUserInterface(weatherData) {
  domManager.updateLocationInfo({
    location: weatherData.location,
  });

  domManager.updateMainInfo({
    temp: weatherData.currentConditions.temp,
    icon: weatherData.currentConditions.icon,
    day: weatherData.days[0],
    feelsLike: weatherData.currentConditions.feelsLike,
    conditions: weatherData.currentConditions.conditions,
  });

  domManager.updateDaysForecastCard({
    description: weatherData.description,
    days: weatherData.days,
  });

  domManager.updateHourlyForecastCard({
    day: weatherData.days[0],
    next24HoursData: weatherData.getNext24HoursData(),
  });

  domManager.updatePrecipitationCard({
    precip: weatherData.currentConditions.precip,
    precipProb: weatherData.currentConditions.precipProb,
  });

  domManager.updateHumidityCard({
    humidity: weatherData.currentConditions.humidity,
  });

  domManager.updateSunriseSunsetCard({
    sunrise: weatherData.currentConditions.sunrise,
    sunset: weatherData.currentConditions.sunset,
  });

  domManager.updatePressureCard({
    pressure: weatherData.currentConditions.pressure,
  });

  domManager.updateWindCard({
    windSpeed: weatherData.currentConditions.windSpeed,
    windDir: weatherData.currentConditions.windDir,
  });

  domManager.updateUvIndexCard({
    uvIndex: weatherData.currentConditions.uvIndex,
  });
}

function handleSubmitQueryForm() {
  const query = domManager.getQueryFormData();
  if (query === '') {
    domManager.showQueryErrorMessage('Enter a location to search for its weather data.');
    return;
  }
  const request = weatherApi.createRequest(query);
  domManager.displayLoadingComponent();

  weatherApi
    .getWeatherData(request)
    .then((weatherData) => {
      currentWeatherData = weatherData;
      updateUserInterface(currentWeatherData);
      domManager.updateBackground({ icon: currentWeatherData.currentConditions.icon });
      domManager.hideQueryErrorMessage();
    })
    .catch(() => {
      const errorMessage = 'It was not possible to find this location.';
      domManager.showQueryErrorMessage(errorMessage);
    })
    .finally(() => {
      domManager.hideLoadingComponent();
    });
}

let currentWeatherData = null;
const submitQueryFormButton = domManager.getSubmitQueryFormButton();

submitQueryFormButton.addEventListener('click', handleSubmitQueryForm);
domManager.initializeSettingsEventListeners(() => {
  updateUserInterface(currentWeatherData);
});

// Initializing the page with a sample request
const initialRequest = weatherApi.createRequest('New York NY USA');

weatherApi.getWeatherData(initialRequest).then((weatherData) => {
  currentWeatherData = weatherData;
  updateUserInterface(currentWeatherData);
  domManager.updateBackground({ icon: currentWeatherData.currentConditions.icon });
});
