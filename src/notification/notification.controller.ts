import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  sendNotification(@Body() notitification: CreateNotificationDto): string {
    return this.notificationService.sendNotification(notitification);
  }

  @Delete(':id')
  removeNotification(@Param('id') id: number): string {
    return this.notificationService.removeNotification(id);
  }
}
