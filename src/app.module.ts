import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { NotificationModule } from './notification/notification.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CartModule,
    NotificationModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'admin', method: RequestMethod.GET })
      .forRoutes(AdminController);
  }
}
