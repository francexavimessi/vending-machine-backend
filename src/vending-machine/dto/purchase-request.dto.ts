import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './product.dto';

export class DenominationDto {
  @ApiProperty({
    example: 50,
    description: 'Value of the denomination (e.g., 50, 100, etc.)',
  })
  @IsNumber()
  @IsPositive()
  value: number;

  @ApiProperty({
    example: 2,
    description: 'Number of such denominations provided',
  })
  @IsNumber()
  @IsPositive()
  count: number;
}

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
  @IsPositive()
  totalPaid: number;

  @ApiProperty({
    type: [DenominationDto],
    description: 'List of denominations used for payment',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DenominationDto) // Enable transformation for nested DTOs
  denominations: DenominationDto[];
}
