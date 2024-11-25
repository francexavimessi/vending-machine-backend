import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ProductResponseDto {
  @ApiProperty({
    example: '63f1cfe1bcf86cd799439011',
    description: 'The unique ID of the product',
  })
  @Expose()
  _id: string;

  @ApiProperty({ example: 'Soda Can', description: 'The name of the product' })
  @Expose()
  name: string;

  @ApiProperty({ example: 15, description: 'Price of the product' })
  @Expose()
  price: number;

  @ApiProperty({ example: 100, description: 'Stock of the product' })
  @Expose()
  stock: number;

  @ApiProperty({
    example: 'drink',
    description: 'The category or kind of the product (e.g., snack, drink)',
  })
  @Expose()
  kind: string;

  @ApiProperty({
    example: '/images/product-image.jpg',
    description: 'The image path for the product',
  })
  @Expose()
  img?: string;

  @Exclude() // Exclude __v property from the response
  __v?: number;
}
