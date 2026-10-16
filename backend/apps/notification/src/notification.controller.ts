import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { BILLING_PATTERNS, BOOKING_PATTERNS, BookingCreatedEvent, GeofenceViolation, PaymentDto, TELEMETRY_PATTERNS } from '@app/contracts';

@Controller()
export class NotificationController {
  constructor(private readonly _notificationService: NotificationService) {}

  @EventPattern(BOOKING_PATTERNS.CREATED_BOOKING)
  async handleCreatedBooking(@Payload() dto: BookingCreatedEvent, @Ctx() context: unknown) {
    const rmqContext = context as RmqContext;
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();

    const startDate = new Date(dto.startTime).toDateString();
    const endDate = new Date(dto.endTime).toDateString();

    try {
      const text = `📦 <b>Новая бронь!</b> 
      \n📩 Почта водителя ${dto.driverEmail} 
      \nЗабронирована с ${startDate} по ${endDate} 
      \nДата бронирования: ${new Date(dto.timestamp).toDateString()}`;

      await this._notificationService.sendTelegramAlert(BOOKING_PATTERNS.CREATED_BOOKING, text);
      await this._notificationService.sendEmail(dto.driverEmail, 
        'Автомобиль забронирован', `<b>Новая бронь!</b> <p>Забронирована с ${startDate} по ${endDate} </p> <p>Дата бронирования: ${new Date(dto.timestamp).toDateString()}</p>`, 
        BOOKING_PATTERNS.CREATED_BOOKING);
      
      channel.ack(originalMessage);
    } catch(error) {
      channel.nack(originalMessage);
    }
  }

  @EventPattern(TELEMETRY_PATTERNS.GEOFENCE_VIOLATION)
  async handleGeofenceViolation(@Payload() data: GeofenceViolation, @Ctx() context: unknown) {
    // @Ctx() - дает контекст транспорта: служебную информацию о том, как пришло сообщение.
    const rmqContext = context as RmqContext;
    // канал - соединение с RabbitMQ через которое сервис общается с брокером. Сообщение пришло по этому каналу, 
    // и подтверждение нужно отправить по нему же. 
    const channel = rmqContext.getChannelRef();
    // Исходное сообщение в сыром ввиде, как его прислал RabbitMQ. В @Payload я получаю уже разобранные данные, а здесь целиком: тело в байтах
    // заголовки и служебный номер доставки. Именно по этому номеру брокер понимает, какое сообщение вы подтверждаете, поэтому в ack передается 
    // original, а не data.
    const originalMessage = rmqContext.getMessage();
    try {
      const text = `🚨 <b>ТРЕВОГА БЕЗОПАСНОСТИ!</b>\nМашина <code>${data.vehicleId}</code> покинула разрешенную геозону!\nВремя: ${data.timestamp.toString()}`;

      await this._notificationService.sendTelegramAlert(TELEMETRY_PATTERNS.GEOFENCE_VIOLATION, text);

      // тут мы вручную подтверждаем RabbitMQ, что получили сообщения для того, чтобы RabbitMQ удалила сообщение.
      channel.ack(originalMessage);
    } catch(error) {
      // не обработано, возвращаем обратно в очередь.
      channel.nack(originalMessage, false, true);
    }
  }

  @EventPattern(BILLING_PATTERNS.PAYMENT_FAILED)
  async paymentFailed(@Payload() dto: PaymentDto, @Ctx() context: unknown) {
    const rmqContext = context as RmqContext;
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();

    try {
      await this._notificationService.sendEmail(dto.driverEmail, 'Ошибка оплаты аренды авто', 
        `Здравствуйте, по броне ${dto.bookingId} образовался долг в размере ${dto.amount} руб.`, BILLING_PATTERNS.PAYMENT_FAILED);
      await this._notificationService.sendTelegramAlert(BILLING_PATTERNS.PAYMENT_FAILED, 
        `Здравствуйте, по броне ${dto.bookingId} образовался долг в размере ${dto.amount} руб.\nПочта должника: ${dto.driverEmail}`);
      channel.ack(originalMessage);
    } catch(error) {    
      channel.nack(originalMessage, false, true);
    }
  }

  @EventPattern(BILLING_PATTERNS.PAYMENT_SUCCESS)
  async paymentSuccess(@Payload() dto: PaymentDto, @Ctx() context: unknown) {
    const rmqContext = context as RmqContext;
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();

    try {      
      await this._notificationService.sendEmail(dto.driverEmail, 'Оплата аренды авто прошла успешно', 
        `Здравствуйте, бронирование оплачено в размере ${dto.amount} руб.\nПочта водителя: ${dto.driverEmail}`, BILLING_PATTERNS.PAYMENT_SUCCESS
      );
      await this._notificationService.sendTelegramAlert(BILLING_PATTERNS.PAYMENT_SUCCESS, 
        `Здравствуйте, бронирование оплачено в размере ${dto.amount} руб.\nПочта водителя: ${dto.driverEmail}`);
      channel.ack(originalMessage);
    } catch(error) {
      channel.nack(originalMessage, false, true);
    }    
  }
}
