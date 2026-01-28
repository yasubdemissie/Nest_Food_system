import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  products: (CreateProductDto & { id: string })[] = [
    {
      id: '1',
      product: 'Banana',
      price: 300,
      type: 'Fruit',
    },
    {
      id: '209ufjw',
      product: 'Shoe',
      price: 4000,
      type: 'Cloth',
    },
  ];

  create(createProductDto: CreateProductDto) {
    try {
      this.products.push({
        ...createProductDto,
        id: new Date().toDateString(),
      });
      return this.products;
    } catch (error) {
      throw new Error("Sorry can't add new product", {
        cause: error,
      });
    }
  }

  findAll(type: string, price: number) {
    try {
      const allProducts = this.products;
      console.log(
        `This action returns all product with ${type} type in ${price} ETB`,
      );
      return allProducts;
    } catch (error) {
      throw new Error('Sorry their is no product to show', { cause: error });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
