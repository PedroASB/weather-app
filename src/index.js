import './css/reset.css';
import './css/style.css';
import * as weatherApi from './js/weather-api.js';
import * as domManager from './js/dom-manager.js';
import sampleData from './js/sample-data.js';

domManager.updateAllSections(sampleData);

const submitQueryFormButton = document.querySelector('#query-form button[type="submit"]');
const submitUnitsFormButton = document.querySelector('#units-form button[type="submit"]');
let currentWeatherData = null;

submitQueryFormButton.addEventListener('click', () => {
  const query = domManager.getQueryFormData();
  const request = weatherApi.createRequest(query);
  weatherApi.getWeatherData(request).then((weatherData) => {
    currentWeatherData = weatherData;
    domManager.updateAllSections(currentWeatherData.getData());
  });
});

submitUnitsFormButton.addEventListener('click', () => {
  const { temperatureUnit, distanceUnit } = domManager.getUnitsFormData();

  switch (temperatureUnit) {
    case 'fahrenheit':
      currentWeatherData.useFahrenheit();
      break;
    case 'celsius':
      currentWeatherData.useCelsius();
      break;
  }

  switch (distanceUnit) {
    case 'metric':
      currentWeatherData.useMetric();
      break;
    case 'imperial':
      currentWeatherData.useImperial();
      break;
  }

  domManager.updateAllSections(currentWeatherData.getData());
});
