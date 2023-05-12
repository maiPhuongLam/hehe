import { IsNotEmpty, IsOptional } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  page: number;

  @IsOptional()
  name: string;

  @IsOptional()
  userId: string;
}
