import WeatherData from './weather-data.js';

const API_KEY = 'ZNUHVB5T8SUGMLTYE5U3XSPFM';
const UNIT_GROUP = 'us';
const DATE = 'next9days';

function createRequest(location) {
  const baseUrl =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
  const requestParameters = `${location}/${DATE}?unitGroup=${UNIT_GROUP}&key=${API_KEY}`;
  const url = baseUrl + requestParameters;
  const request = new Request(url, { method: 'GET' });
  return request;
}

async function fetchData(request) {
  const response = await fetch(request);
  if (!response.ok) {
    throw Error(`Not successful response. Status: ${response.status}`);
  }
  const rawData = await response.json();
  return rawData;
}

async function getWeatherData(request) {
  const rawData = await fetchData(request);
  return new WeatherData(rawData);
}

export { createRequest, getWeatherData };
