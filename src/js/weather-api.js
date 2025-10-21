export { createRequest, getWeatherData };

const API_KEY = 'ZNUHVB5T8SUGMLTYE5U3XSPFM';
const UNIT_GROUP = 'us';
const DATE = 'next10days';

function createRequest(location) {
  const baseUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/`;
  const requestParameters = `${location}/${DATE}?unitGroup=${UNIT_GROUP}&key=${API_KEY}`;
  const url = baseUrl + requestParameters;
  const request = new Request(url, { method: 'GET' });
  return request;
}

async function fetchData(request) {
  try {
    const response = await fetch(request);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function processWeatherData(data) {
  const forecast = {};

  data.days.forEach((day) => {
    forecast[day.datetime] = {
      icon: day.icon,
      tempmin: day.tempmin,
      tempmax: day.tempmax,
    };
  });

  const currentConditions = {
    icon: data.currentConditions.icon,
    datetime: data.currentConditions.datetime,
    conditions: data.currentConditions.conditions,
    temp: data.currentConditions.temp,
    feelslike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    precip: data.currentConditions.precip,
    precipprob: data.currentConditions.precipprob,
    uvindex: data.currentConditions.uvindex,
    pressure: data.currentConditions.pressure,
    windspeed: data.currentConditions.windspeed,
    winddir: data.currentConditions.winddir,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
  };

  const processedData = {
    resolvedAddress: data.resolvedAddress,
    description: data.description,
    timeZoneOffset: data.tzoffset,
    alerts: data.alerts,
    currentConditions,
    forecast,
  };

  return processedData;
}

async function getWeatherData(request) {
  const data = await fetchData(request);
  return processWeatherData(data);
}
