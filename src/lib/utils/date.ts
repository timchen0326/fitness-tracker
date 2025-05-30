export function toEasternTime(date: Date): Date {
  return new Date(date.toLocaleString('en-US', {
    timeZone: 'America/New_York'
  }));
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export function getCurrentEasternTime(): string {
  const now = new Date();
  const easternDate = new Date(now.toLocaleString('en-US', {
    timeZone: 'America/New_York'
  }));
  
  // Format for datetime-local input (YYYY-MM-DDThh:mm)
  const year = easternDate.getFullYear();
  const month = String(easternDate.getMonth() + 1).padStart(2, '0');
  const day = String(easternDate.getDate()).padStart(2, '0');
  const hours = String(easternDate.getHours()).padStart(2, '0');
  const minutes = String(easternDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
} 