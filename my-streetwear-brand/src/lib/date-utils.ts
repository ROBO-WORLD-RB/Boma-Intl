/**
 * Date Utilities for Delivery Scheduling
 * 
 * Requirements: 3.2, 3.3, 3.4, 3.7
 */

/**
 * Cutoff hour for same-day processing (6PM = 18:00)
 * Orders placed before this time can be delivered tomorrow
 * Orders placed after this time will be delivered day after tomorrow
 */
export const CUTOFF_HOUR = 18;

/**
 * Maximum days in the future for delivery scheduling
 */
export const MAX_FUTURE_DAYS = 14;

/**
 * Ghana public holidays (month-day format for recurring, full date for specific years)
 * Note: This is a simplified list - in production, this should be fetched from a service
 */
export const GHANA_PUBLIC_HOLIDAYS_2025: string[] = [
  '2025-01-01', // New Year's Day
  '2025-03-06', // Independence Day
  '2025-04-18', // Good Friday
  '2025-04-21', // Easter Monday
  '2025-05-01', // May Day
  '2025-05-25', // Africa Day
  '2025-07-01', // Republic Day
  '2025-08-04', // Founders' Day
  '2025-09-21', // Kwame Nkrumah Memorial Day
  '2025-12-01', // Farmers' Day
  '2025-12-25', // Christmas Day
  '2025-12-26', // Boxing Day
];

/**
 * Checks if a date is a Sunday
 * 
 * @param date - The date to check
 * @returns true if the date is a Sunday
 */
export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

/**
 * Checks if a date is a public holiday
 * 
 * @param date - The date to check
 * @returns true if the date is a public holiday
 */
export function isPublicHoliday(date: Date): boolean {
  const dateString = formatDateISO(date);
  return GHANA_PUBLIC_HOLIDAYS_2025.includes(dateString);
}

/**
 * Checks if a date is a blackout date (Sunday or public holiday)
 * 
 * Requirements: 3.4
 * 
 * @param date - The date to check
 * @returns true if the date is a blackout date
 */
export function isBlackoutDate(date: Date): boolean {
  return isSunday(date) || isPublicHoliday(date);
}

/**
 * Formats a date as ISO date string (YYYY-MM-DD)
 * 
 * @param date - The date to format
 * @returns ISO date string
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets the start of day for a given date (midnight)
 * 
 * @param date - The date
 * @returns New date set to midnight
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Adds days to a date
 * 
 * @param date - The base date
 * @param days - Number of days to add
 * @returns New date with days added
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculates the difference in days between two dates
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference (positive if date1 > date2)
 */
export function daysDifference(date1: Date, date2: Date): number {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  const diffTime = d1.getTime() - d2.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a date is in the past (before today)
 * 
 * Requirements: 3.2
 * 
 * @param date - The date to check
 * @param referenceDate - Optional reference date (defaults to now)
 * @returns true if the date is in the past
 */
export function isPastDate(date: Date, referenceDate: Date = new Date()): boolean {
  const dateStart = startOfDay(date);
  const todayStart = startOfDay(referenceDate);
  return dateStart < todayStart;
}

/**
 * Checks if a date is too far in the future (more than MAX_FUTURE_DAYS)
 * 
 * Requirements: 3.3
 * 
 * @param date - The date to check
 * @param referenceDate - Optional reference date (defaults to now)
 * @returns true if the date is more than 14 days in the future
 */
export function isTooFarInFuture(date: Date, referenceDate: Date = new Date()): boolean {
  const todayStart = startOfDay(referenceDate);
  const maxDate = addDays(todayStart, MAX_FUTURE_DAYS);
  const dateStart = startOfDay(date);
  return dateStart > maxDate;
}

/**
 * Gets the minimum delivery date based on current time
 * 
 * Requirements: 3.7
 * - If before 6PM: tomorrow
 * - If at or after 6PM: day after tomorrow
 * 
 * @param referenceDate - Optional reference date (defaults to now)
 * @returns The minimum delivery date
 */
export function getMinDeliveryDate(referenceDate: Date = new Date()): Date {
  const currentHour = referenceDate.getHours();
  const daysToAdd = currentHour < CUTOFF_HOUR ? 1 : 2;
  
  let minDate = addDays(startOfDay(referenceDate), daysToAdd);
  
  // Skip blackout dates
  while (isBlackoutDate(minDate)) {
    minDate = addDays(minDate, 1);
  }
  
  return minDate;
}

/**
 * Gets the maximum delivery date (14 days from today)
 * 
 * Requirements: 3.3
 * 
 * @param referenceDate - Optional reference date (defaults to now)
 * @returns The maximum delivery date
 */
export function getMaxDeliveryDate(referenceDate: Date = new Date()): Date {
  return addDays(startOfDay(referenceDate), MAX_FUTURE_DAYS);
}

/**
 * Validates if a delivery date is valid
 * 
 * Requirements: 3.2, 3.3, 3.4
 * 
 * @param date - The date to validate
 * @param referenceDate - Optional reference date (defaults to now)
 * @returns Object with isValid flag and optional error message
 */
export function isValidDeliveryDate(
  date: Date,
  referenceDate: Date = new Date()
): { isValid: boolean; error?: string } {
  // Check if date is in the past
  if (isPastDate(date, referenceDate)) {
    return { isValid: false, error: 'Delivery date cannot be in the past' };
  }

  // Check if date is too far in the future
  if (isTooFarInFuture(date, referenceDate)) {
    return { isValid: false, error: 'Delivery date cannot be more than 14 days in the future' };
  }

  // Check if date is a blackout date
  if (isBlackoutDate(date)) {
    return { isValid: false, error: 'Delivery is not available on Sundays or public holidays' };
  }

  // Check minimum lead time
  const minDate = getMinDeliveryDate(referenceDate);
  if (startOfDay(date) < startOfDay(minDate)) {
    return { isValid: false, error: 'Please select a date with sufficient lead time' };
  }

  return { isValid: true };
}

/**
 * Gets an array of valid delivery dates for the next 14 days
 * 
 * @param referenceDate - Optional reference date (defaults to now)
 * @returns Array of valid delivery dates
 */
export function getValidDeliveryDates(referenceDate: Date = new Date()): Date[] {
  const validDates: Date[] = [];
  const minDate = getMinDeliveryDate(referenceDate);
  const maxDate = getMaxDeliveryDate(referenceDate);
  
  let currentDate = new Date(minDate);
  
  while (currentDate <= maxDate) {
    if (!isBlackoutDate(currentDate)) {
      validDates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return validDates;
}
