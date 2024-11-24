import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './product.dto';

export class PurchaseRequestDto {
  @ApiProperty({
    type: [ProductDto],
    description: 'List of products with their quantities',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto) // Enable transformation for nested DTOs
  products: ProductDto[];

  @ApiProperty({
    example: 100,
    description: 'Total money paid by the customer',
  })
  @IsNumber()
  // @IsPositive()
  totalPaid: number;
}
