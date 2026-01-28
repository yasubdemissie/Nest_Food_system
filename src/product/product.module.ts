import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [NotificationModule],
})
export class ProductModule {}
