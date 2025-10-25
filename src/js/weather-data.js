import {
  getCelsiusFromFahrenheit,
  getFahrenheitFromCelsius,
  getMilimitersFromInches,
  getKphFromMph,
  getInchesFromMilimiters,
  getMphFromKph,
} from './unit-conversion.js';

export default class WeatherData {
  #data = {};
  #usingCelsius;
  #usingMetric;
  #temperatureUnit = '°F';
  #precipitationUnit = 'in';
  #windSpeedUnit = 'mph';

  constructor(rawData) {
    this.#data = this.#processData(rawData);
    this.#usingCelsius = false;
    this.#usingMetric = false;
  }

  #processData(rawData) {
    if (!rawData) {
      console.error('Invalid raw data at proccess data method.');
      return;
    }

    const days = [];

    for (const day of rawData.days) {
      days.push({
        date: day.datetime,
        icon: day.icon,
        tempMin: Math.round(day.tempmin),
        tempMax: Math.round(day.tempmax),
      });
    }

    const currentConditions = {
      icon: rawData.currentConditions.icon,
      time: rawData.currentConditions.datetime,
      conditions: rawData.currentConditions.conditions,
      temp: Math.round(rawData.currentConditions.temp),
      feelsLike: Math.round(rawData.currentConditions.feelslike),
      humidity: Math.round(rawData.currentConditions.humidity),
      precip: rawData.currentConditions.precip,
      precipProb: Math.round(rawData.currentConditions.precipprob),
      uvIndex: rawData.currentConditions.uvindex,
      pressure: rawData.currentConditions.pressure,
      windSpeed: rawData.currentConditions.windspeed,
      windDir: rawData.currentConditions.winddir,
      sunrise: rawData.currentConditions.sunrise,
      sunset: rawData.currentConditions.sunset,
    };

    const currentDay = { hours: [] };

    for (const hour of rawData.days[0].hours) {
      currentDay.hours.push({
        time: hour.datetime,
        temp: Math.round(hour.temp),
        precipProb: Math.round(hour.precipprob),
        icon: hour.icon,
      });
    }

    const processedData = {
      location: rawData.resolvedAddress,
      description: rawData.description,
      timeZoneOffset: rawData.tzoffset,
      alerts: rawData.alerts,
      days,
      currentConditions,
      currentDay,
    };

    return processedData;
  }

  getData() {
    // Deep copying data
    return JSON.parse(JSON.stringify(this.#data));
  }

  getTemperatureUnit() {
    return this.#temperatureUnit;
  }

  getPrecipitationUnit() {
    return this.#precipitationUnit;
  }

  getWindSpeedUnit() {
    return this.#windSpeedUnit;
  }

  #updateTemperatureUnit(updateFunction) {
    this.#data.currentConditions.temp = Math.round(
      updateFunction(this.#data.currentConditions.temp),
    );

    this.#data.currentConditions.feelsLike = Math.round(
      updateFunction(this.#data.currentConditions.feelsLike),
    );

    this.#data.currentDay.hours.forEach((hour) => {
      hour.temp = Math.round(updateFunction(hour.temp));
    });

    this.#data.days.forEach((day) => {
      day.tempMin = Math.round(updateFunction(day.tempMin));
      day.tempMax = Math.round(updateFunction(day.tempMax));
    });
  }

  #updatePrecipitationUnit(updateFunction) {
    this.#data.currentConditions.precip = updateFunction(this.#data.currentConditions.precip);
  }

  #updateWindSpeedUnit(updateFunction) {
    this.#data.currentConditions.windSpeed = updateFunction(
      this.#data.currentConditions.windSpeed,
    ).toFixed(1);
  }

  useCelsius() {
    if (this.#usingCelsius) return;
    this.#usingCelsius = true;
    this.#temperatureUnit = '°C';
    this.#updateTemperatureUnit(getCelsiusFromFahrenheit);
  }

  useFahrenheit() {
    if (!this.#usingCelsius) return;
    this.#usingCelsius = false;
    this.#temperatureUnit = '°F';
    this.#updateTemperatureUnit(getFahrenheitFromCelsius);
  }

  useMetric() {
    if (this.#usingMetric) return;
    this.#usingMetric = true;
    this.#precipitationUnit = 'mm';
    this.#windSpeedUnit = 'km/h';
    this.#updatePrecipitationUnit(getMilimitersFromInches);
    this.#updateWindSpeedUnit(getKphFromMph);
  }

  useImperial() {
    if (!this.#usingMetric) return;
    this.#usingMetric = false;
    this.#precipitationUnit = 'in';
    this.#windSpeedUnit = 'mph';
    this.#updatePrecipitationUnit(getInchesFromMilimiters);
    this.#updateWindSpeedUnit(getMphFromKph);
  }
}
