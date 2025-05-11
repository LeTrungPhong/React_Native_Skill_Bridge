export const formatShortTime = (dateString: string): string => {
  const fixedDateString = dateString.replace(' ', 'T').replace(/\.\d+$/, '');

  const date = new Date(fixedDateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear().toString();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}, ${day}/${month}/${year}`;
}