import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotificationService } from 'src/notification/notification.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    const result = this.productService.create(createProductDto);
    const notify = `Product created: ${createProductDto.product}`;
    const message = this.notificationService.sendNotification({
      message: notify,
    });
    return { result, message };
  }

  @Get()
  findAll(@Query('type') type: string, @Query('price') price: number) {
    return this.productService.findAll(type, price);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
