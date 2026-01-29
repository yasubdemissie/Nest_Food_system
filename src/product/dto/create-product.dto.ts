import { IsDecimal, IsString, MinLength } from 'class-validator';

type productTypes =
  | 'Fruit'
  | 'Cloth'
  | 'Electronic'
  | 'Food'
  | 'Vegitable'
  | 'Housing'
  | 'Beauty';

export class CreateProductDto {
  @IsString()
  id: string;

  @IsString()
  @MinLength(30)
  product: string;

  @IsString()
  type: productTypes;

  @IsDecimal()
  price: number;
}

export class ProductStruc {
  @IsString()
  @MinLength(30)
  product: string;

  @IsString()
  type: productTypes;

  @IsDecimal()
  price: number;
}
