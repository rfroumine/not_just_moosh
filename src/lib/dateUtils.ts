/**
 * Get a date string in YYYY-MM-DD format using local timezone.
 * This avoids the UTC conversion issue with toISOString() which can
 * cause off-by-one day errors in timezones behind UTC.
 */
export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
