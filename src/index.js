import './css/reset.css';
import './css/style.css';
import * as weatherApi from './js/weather-api.js';
import * as domManager from './js/dom-manager.js';
import sampleData from './js/sample-data.js';

// domManager.updateAllSections(sampleData);

const submitQueryFormButton = document.querySelector('#query-form button[type="submit"]');
const initialRequest = weatherApi.createRequest('New York USA');
let currentWeatherData = null;

weatherApi.getWeatherData(initialRequest).then((weatherData) => {
  currentWeatherData = weatherData;
  domManager.updateAllSections(currentWeatherData);
});

submitQueryFormButton.addEventListener('click', () => {
  const query = domManager.getQueryFormData();
  const request = weatherApi.createRequest(query);
  weatherApi
    .getWeatherData(request)
    .then((weatherData) => {
      currentWeatherData = weatherData;
      domManager.updateAllSections(currentWeatherData);
    })
    .catch(() => {
      alert('It was not possible to find this location.');
    });
});

function initializeEventListeners() {
  const fahrenheitButton = document.querySelector('#fahrenheit-btn');
  const celsiusButton = document.querySelector('#celsius-btn');
  const metricButton = document.querySelector('#metric-btn');
  const imperialButton = document.querySelector('#imperial-btn');

  fahrenheitButton.addEventListener('click', () => {
    fahrenheitButton.setAttribute('selected', true);
    celsiusButton.removeAttribute('selected');
    domManager.switchToFahrenheit(currentWeatherData);
  });

  celsiusButton.addEventListener('click', () => {
    celsiusButton.setAttribute('selected', true);
    fahrenheitButton.removeAttribute('selected');
    domManager.switchToCelsius(currentWeatherData);
  });

  imperialButton.addEventListener('click', () => {
    imperialButton.setAttribute('selected', true);
    metricButton.removeAttribute('selected');
    domManager.switchToImperial(currentWeatherData);
  });

  metricButton.addEventListener('click', () => {
    metricButton.setAttribute('selected', true);
    imperialButton.removeAttribute('selected');
    domManager.switchToMetric(currentWeatherData);
  });
}

initializeEventListeners();
