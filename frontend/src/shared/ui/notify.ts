import { notifications } from '@mantine/notifications';

export function notifySuccess(message: string) {
  notifications.show({ color: 'green', message, autoClose: 3000 });
}

export function notifyError(message: string) {
  notifications.show({ color: 'red', title: 'Ошибка', message, autoClose: 6000 });
}