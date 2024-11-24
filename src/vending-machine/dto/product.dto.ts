import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive } from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: '64af72de9e2f9c4a8f2d9eaa',
    description: 'Unique identifier of the product',
  })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  @IsNumber()
  @IsPositive()
  quantity: number;
}
