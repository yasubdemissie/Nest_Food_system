import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  sendNotification(notification: CreateNotificationDto): string {
    const { message } = notification;
    return `${message}`;
  }
  removeNotification(id: number): string {
    return `Notification with id: ${id} has been removed`;
  }
}
