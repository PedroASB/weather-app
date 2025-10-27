export function getPressureFeeback(pressure) {
  if (pressure <= 995) return 'Very low';
  if (pressure <= 1005) return 'Low';
  if (pressure <= 1020) return 'Normal';
  if (pressure <= 1030) return 'High';
  return 'Very high';
}

export function getHumidityFeedback(humidity) {
  if (humidity <= 20) return 'Very low';
  if (humidity <= 40) return 'Low';
  if (humidity <= 60) return 'Normal';
  if (humidity <= 80) return 'High';
  return 'Very high';
}

export function getUvIndexFeedback(uvIndex) {
  if (uvIndex <= 2)
    return {
      text: 'Safe',
      color: '#66ad4a',
      barWidthProportion: uvIndex,
    };

  if (uvIndex <= 5)
    return {
      text: 'Moderate',
      color: '#eeb414',
      barWidthProportion: uvIndex,
    };

  if (uvIndex <= 7)
    return {
      text: 'High',
      color: '#ee7d14',
      barWidthProportion: uvIndex,
    };

  if (uvIndex <= 10)
    return {
      text: 'Very high',
      color: '#e25b5b',
      barWidthProportion: uvIndex,
    };

  return {
    text: 'Extreme',
    color: '#b843cf',
    barWidthProportion: 11,
  };
}

export function getWindSpeedFeedback(windSpeed) {
  if (windSpeed <= 3) return 'Calm';
  if (windSpeed <= 12) return 'Light breeze';
  if (windSpeed <= 24) return 'Moderate wind';
  if (windSpeed <= 38) return 'Strong wind';
  if (windSpeed <= 55) return 'Very strong wind';
  return 'Severe wind storm';
}

export function getPrecipProbFeedback(precipProb) {
  if (precipProb <= 10) return 'Very low chance';
  if (precipProb <= 30) return 'Low chance';
  if (precipProb <= 60) return 'Moderate chance';
  if (precipProb <= 80) return 'High chance';
  return 'Very high chance';
}

export function getPrecipLevelFeedback(precipLevel) {
  if (precipLevel <= 0.01) return 'No rain';
  if (precipLevel <= 0.1) return 'Light rain';
  if (precipLevel <= 0.3) return 'Moderate rain';
  if (precipLevel <= 2.0) return 'Heavy rain';
  if (precipLevel <= 4.0) return 'Very heavy rain';
  return 'Extreme rain';
}

export function getWindDirectionFeedback(degrees) {
  if (degrees <= 22.5) return 'North';
  if (degrees <= 67.5) return 'Northeast';
  if (degrees <= 112.5) return 'East';
  if (degrees <= 157.5) return 'Southeast';
  if (degrees <= 202.5) return 'South';
  if (degrees <= 247.5) return 'Southwest';
  if (degrees <= 292.5) return 'West';
  if (degrees <= 337.5) return 'Northwest';
  return 'North';
}
