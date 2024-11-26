import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Soda Can', description: 'The name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ example: 15, description: 'Price of the product' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 100, description: 'Stock of the product' })
  @IsNumber()
  // @IsPositive()
  stock: number;


  @ApiProperty({
    example: 'drink',
    description: 'The category or kind of the product (e.g., snack, drink)',
    enum: ['snack', 'drink'],
  })
  @IsString()
  @IsEnum(['snack', 'drink'])
  kind: string;

  @ApiProperty({
    example: '/images/product-image.jpg',
    description: 'The image path for the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  img?: string;
}
