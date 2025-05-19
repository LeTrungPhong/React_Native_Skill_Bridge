// Format date time
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
};

// Truncate string
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

// Get random color for avatar
const COLORS = [
  '#5DADE2', 
  '#F5B041',
  '#58D68D',
  '#BB8FCE',
  '#EC7063',
  '#45B39D',
  '#AF7AC5',
  '#5499C7',
  '#52BE80',
  '#F4D03F',
];

export const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};