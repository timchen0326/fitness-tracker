export function toTorontoTime(date: Date): Date {
  return new Date(date.toLocaleString('en-US', {
    timeZone: 'America/Toronto'
  }));
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    timeZone: 'America/Toronto',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export function getCurrentTorontoTime(): string {
  const now = new Date();
  const torontoDate = new Date(now.toLocaleString('en-US', {
    timeZone: 'America/Toronto'
  }));
  
  // Format for datetime-local input (YYYY-MM-DDThh:mm)
  const year = torontoDate.getFullYear();
  const month = String(torontoDate.getMonth() + 1).padStart(2, '0');
  const day = String(torontoDate.getDate()).padStart(2, '0');
  const hours = String(torontoDate.getHours()).padStart(2, '0');
  const minutes = String(torontoDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
} 