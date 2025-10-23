export { createRequest, getWeatherData };

const API_KEY = 'ZNUHVB5T8SUGMLTYE5U3XSPFM';
const UNIT_GROUP = 'us';
const DATE = 'next9days';

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
  const days = [];

  for (const day of data.days) {
    days.push({
      date: day.datetime,
      icon: '[icon]', // temporary
      tempMin: day.tempmin,
      tempMax: day.tempmax,
    });
  }

  const currentConditions = {
    icon: data.currentConditions.icon,
    time: data.currentConditions.datetime,
    conditions: data.currentConditions.conditions,
    temp: data.currentConditions.temp,
    feelsLike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    precip: data.currentConditions.precip,
    precipProb: data.currentConditions.precipprob,
    uvIndex: data.currentConditions.uvindex,
    pressure: data.currentConditions.pressure,
    windSpeed: data.currentConditions.windspeed,
    windDir: data.currentConditions.winddir,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
  };

  const currentDay = { hours: [] };

  for (const hour of data.days[0].hours) {
    currentDay.hours.push({
      time: hour.datetime,
      temp: hour.temp,
      precipProb: hour.precipprob,
      icon: '[icon]', // temporary
    });
  }

  const processedData = {
    location: data.resolvedAddress,
    description: data.description,
    timeZoneOffset: data.tzoffset,
    alerts: data.alerts,
    currentConditions,
    days,
    currentDay,
  };

  return processedData;
}

async function getWeatherData(request) {
  const data = await fetchData(request);
  return processWeatherData(data);
}
