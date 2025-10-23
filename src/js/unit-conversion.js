export const getCelsiusFromFahrenheit = (fahrenheit) => (5 / 9) * (fahrenheit - 32);

export const getFahrenheitFromCelsius = (celsius) => (9 / 5) * celsius + 32;

export const getMilimitersFromInches = (inches) => inches * 25.4;

export const getInchesFromMilimiters = (milimiters) => milimiters / 25.4;

// Get miles per hour from kilometers per hour
export const getMphFromKph = (kph) => kph / 1.609;

// Get kilometers per hour from miles per hour
export const getKphFromMph = (mph) => mph * 1.609;
