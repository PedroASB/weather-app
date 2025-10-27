export default class WeatherData {
  location = null;
  description = null;
  timeZoneOffset = null;
  days = [];
  currentConditions = {};
  currentDay = { hours: [] };
  nextDay = { hours: [] };

  constructor(rawData) {
    if (!rawData) {
      throw Error('Invalid raw data at proccess data method.');
    }

    this.location = rawData.resolvedAddress;
    this.description = rawData.description;
    this.timeZoneOffset = rawData.tzoffset;

    for (const day of rawData.days) {
      this.days.push({
        date: day.datetime,
        icon: day.icon,
        tempMin: Math.round(day.tempmin),
        tempMax: Math.round(day.tempmax),
      });
    }

    this.currentConditions = {
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

    for (const hour of rawData.days[0].hours) {
      this.currentDay.hours.push({
        time: hour.datetime,
        temp: Math.round(hour.temp),
        precipProb: Math.round(hour.precipprob),
        icon: hour.icon,
      });
    }

    for (const hour of rawData.days[1].hours) {
      this.nextDay.hours.push({
        time: hour.datetime,
        temp: Math.round(hour.temp),
        precipProb: Math.round(hour.precipprob),
        icon: hour.icon,
      });
    }
  }

  getNext24HoursData() {
    const getHoursFromTime = (time) => time.split(':')[0];
    const currentHours = getHoursFromTime(this.currentConditions.time);
    const next24HoursData = [];

    let currentDayIndex = 0;
    for (const hour of this.currentDay.hours) {
      if (getHoursFromTime(hour.time) >= currentHours) {
        next24HoursData.push(this.currentDay.hours[currentDayIndex]);
      }
      currentDayIndex++;
    }

    let nextDayIndex = 0;
    while (next24HoursData.length < 24) {
      next24HoursData.push(this.nextDay.hours[nextDayIndex]);
      nextDayIndex++;
    }

    return next24HoursData;
  }
}
