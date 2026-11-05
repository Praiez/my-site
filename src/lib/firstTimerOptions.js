export const MARITAL_STATUSES = ["Single", "Married", "Widowed", "Divorced", "Separated", "Prefer not to say"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// A fixed leap reference year, so February can offer the 29th.
const REFERENCE_YEAR = 2024;

export const daysInMonth = (month) => new Date(Date.UTC(REFERENCE_YEAR, month, 0)).getUTCDate();

export const firstWeekdayOfMonth = (month) => new Date(Date.UTC(REFERENCE_YEAR, month - 1, 1)).getUTCDay();

export const formatBirthday = (month, day) =>
  month && day ? `${day} ${MONTHS[month - 1]}` : null;