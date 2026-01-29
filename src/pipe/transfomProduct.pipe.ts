import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ProductStruc } from 'src/product/dto/create-product.dto';

@Injectable()
export class ParseProduct implements PipeTransform {
  transform(value: ProductStruc, metadata: ArgumentMetadata) {
    console.log('This the product in Pipe: ', value);
    const product = {
      ...value,
      id: new Date().toString(),
    };

    return product;
  }
}
