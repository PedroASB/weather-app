import { format as formatDateFns } from 'date-fns';

function getDateFromString(dateString) {
  const [year, month, day] = dateString.split('-');
  return new Date(year, month - 1, day);
}

export function getFormattedDate(dateString) {
  const date = getDateFromString(dateString);
  return formatDateFns(date, "EEEE',' MMMM do");
}

export function getWeekDay(dateString) {
  const date = getDateFromString(dateString);
  return formatDateFns(date, 'E');
}

export function convertTo12HourClock(timeString) {
  const [hours, minutes, seconds] = timeString.split(':');
  const period = hours < 12 ? 'AM' : 'PM';
  return { hours: hours % 12 || 12, minutes, seconds, period };
}
