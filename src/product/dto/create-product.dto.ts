import { IsNotEmpty } from 'class-validator';

export class createProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;
}
