import './css/reset.css';
import './css/style.css';
import * as weatherApi from './js/weather-api.js';
import * as domManager from './js/dom-manager.js';
import sampleData from './js/sample-data.js';

domManager.updateAllSections(sampleData);

const submitForm = document.querySelector('#query-form button[type="submit"]');
submitForm.addEventListener('click', () => {
  const query = domManager.getFormData();
  const request = weatherApi.createRequest(query);
  weatherApi.getWeatherData(request).then((data) => {
    domManager.updateAllSections(data);
  });
});
