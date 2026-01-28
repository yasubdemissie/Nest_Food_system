export class CreateProductDto {
  product: string;
  type: productTypes;
  price: number;
}

type productTypes =
  | 'Fruit'
  | 'Cloth'
  | 'Electronic'
  | 'Food'
  | 'Vegitable'
  | 'Housing'
  | 'Beauty';
