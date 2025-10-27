export default class WeatherData {
  #data = {};

  constructor(rawData) {
    this.#data = this.#processData(rawData);
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
      // Note: some stations only record precipitation when there are positive values;
      // they don't explicitly zero-fill when there is no rain
      precip: rawData.currentConditions.precip ?? 0,
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

    const nextDay = { hours: [] };

    for (const hour of rawData.days[1].hours) {
      nextDay.hours.push({
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
      days,
      currentConditions,
      currentDay,
      nextDay,
    };

    return processedData;
  }

  getData() {
    // Deep copying data
    return JSON.parse(JSON.stringify(this.#data));
  }

  getNext24HoursData() {
    const currentHours = this.#data.currentConditions.time.split(':')[0];
    const currentDay = this.#data.currentDay;
    const nextDay = this.#data.nextDay;
    const next24HoursData = [];

    let currentDayIndex = 0;
    for (const hour of currentDay.hours) {
      if (hour.time.split(':')[0] >= currentHours) {
        next24HoursData.push(currentDay.hours[currentDayIndex]);
      }
      currentDayIndex++;
    }

    let nextDayIndex = 0;
    while (next24HoursData.length < 24) {
      next24HoursData.push(nextDay.hours[nextDayIndex]);
      nextDayIndex++;
    }

    return next24HoursData;
  }
}
