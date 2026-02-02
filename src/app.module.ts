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
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { prismaService } from './helper/prisma.service';
import { prismaModule } from './helper/prisma.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CartModule,
    // prismaModule,
    NotificationModule,
    AdminModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, prismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'admin', method: RequestMethod.GET })
      .forRoutes(AdminController);
  }
}
