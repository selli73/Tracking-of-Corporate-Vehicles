export const formatKm = (km: number) => `${km.toFixed(2)} км`;

const moneyFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
});

export const formatMoney = (value: string | number) => moneyFormatter.format(Number(value));

const dateFormatter = new Intl.DateTimeFormat('ru-RU');

export const  formatDate = (value: string) => dateFormatter.format(new Date(value));

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short'
});

export const formatDateTime = (value: string) => dateTimeFormatter.format(new Date(value));

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} мин`;
  if (minutes === 0) return `${hours} ч`;
  return `${hours} ч ${minutes} мин`;
}