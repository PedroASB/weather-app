import './css/reset.css';
import './css/style.css';
import * as weatherApi from './js/weather-api.js';
import * as domManager from './js/dom-manager.js';
import sampleRawData from './js/sample-raw-data.json';
import WeatherData from './js/weather-data.js';

let currentWeatherData = new WeatherData(sampleRawData);
domManager.updateAllSections(currentWeatherData);
domManager.updateBackground(currentWeatherData);

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
      domManager.updateAllSections(currentWeatherData);
      domManager.updateBackground(currentWeatherData);
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

function initializeSettingsEventListeners() {
  const fahrenheitButton = document.querySelector('#fahrenheit-btn');
  const celsiusButton = document.querySelector('#celsius-btn');
  const metricButton = document.querySelector('#metric-btn');
  const imperialButton = document.querySelector('#imperial-btn');

  fahrenheitButton.addEventListener('click', () => {
    fahrenheitButton.setAttribute('selected', true);
    celsiusButton.removeAttribute('selected');
    domManager.switchToFahrenheit();
    domManager.updateAllSections(currentWeatherData);
  });

  celsiusButton.addEventListener('click', () => {
    celsiusButton.setAttribute('selected', true);
    fahrenheitButton.removeAttribute('selected');
    domManager.switchToCelsius();
    domManager.updateAllSections(currentWeatherData);
  });

  imperialButton.addEventListener('click', () => {
    imperialButton.setAttribute('selected', true);
    metricButton.removeAttribute('selected');
    domManager.switchToImperial();
    domManager.updateAllSections(currentWeatherData);
  });

  metricButton.addEventListener('click', () => {
    metricButton.setAttribute('selected', true);
    imperialButton.removeAttribute('selected');
    domManager.switchToMetric();
    domManager.updateAllSections(currentWeatherData);
  });
}

initializeSettingsEventListeners();
const submitQueryFormButton = domManager.getSubmitQueryFormButton();
submitQueryFormButton.addEventListener('click', handleSubmitQueryForm);
