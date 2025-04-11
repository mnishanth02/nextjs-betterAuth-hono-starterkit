import { format, formatInTimeZone, toDate } from "date-fns-tz";

// Get the user's timezone
export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Convert a date to UTC, considering the source timezone
export const toUTC = (date: Date | string, sourceTimeZone: string = getUserTimeZone()): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return toDate(dateObj, { timeZone: sourceTimeZone });
};

// Convert UTC date to user's timezone
export const fromUTC = (date: Date | string, targetTimeZone: string = getUserTimeZone()): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return toDate(dateObj, { timeZone: targetTimeZone });
};

// Format a date in the user's timezone
export const formatDate = (
  date: Date | string,
  formatStr = "yyyy-MM-dd",
  timeZone: string = getUserTimeZone()
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatInTimeZone(dateObj, timeZone, formatStr);
};

// Parse a date string and convert it to UTC
export const parseDateToUTC = (dateStr: string, timeZone: string = getUserTimeZone()): string => {
  const localDate = new Date(dateStr);
  const utcDate = toUTC(localDate, timeZone);
  return utcDate.toISOString();
};

// Format UTC date for display in user's timezone
export const formatUTCForDisplay = (
  utcDate: string | Date,
  formatStr = "yyyy-MM-dd",
  timeZone: string = getUserTimeZone()
): string => {
  const dateObj = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
  const zonedDate = fromUTC(dateObj, timeZone);
  return format(zonedDate, formatStr);
};

// Get start of day in UTC for a given local date
export const getStartOfDayUTC = (
  date: Date | string,
  timeZone: string = getUserTimeZone()
): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const localStartOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
  return toUTC(localStartOfDay, timeZone);
};

// Get end of day in UTC for a given local date
export const getEndOfDayUTC = (date: Date | string, timeZone: string = getUserTimeZone()): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const localEndOfDay = new Date(dateObj.setHours(23, 59, 59, 999));
  return toUTC(localEndOfDay, timeZone);
};
