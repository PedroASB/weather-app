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

const submitQueryFormButton = domManager.getSubmitQueryFormButton();
const getCurrentWeatherData = () => currentWeatherData;

domManager.initializeSettingsEventListeners(getCurrentWeatherData);
submitQueryFormButton.addEventListener('click', handleSubmitQueryForm);
