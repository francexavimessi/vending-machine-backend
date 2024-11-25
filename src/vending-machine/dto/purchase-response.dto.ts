import { ApiProperty } from '@nestjs/swagger';

export class ChangeItemDto {
  @ApiProperty({
    example: 10,
    description: 'Denomination of the coin or banknote',
  })
  denomination: number;

  @ApiProperty({ example: 5, description: 'Quantity of the denomination' })
  quantity: number;
}

export class ValidatedProductDto {
  @ApiProperty({
    example: '64af72de9e2f9c4a8f2d9eaa',
    description: 'ID of the purchased product',
  })
  productId: string;

  @ApiProperty({
    example: 'Soda Can',
    description: 'Name of the purchased product',
  })
  productName: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the purchased product',
  })
  quantity: number;

  @ApiProperty({
    example: 15,
    description: 'Price of the product per unit',
  })
  price: number;
}

export class PurchaseResponseDto {
  @ApiProperty({
    example: '674397590fe38e93dea7d3d0',
    description: 'Unique transaction ID',
  })
  transactionId: string;

  @ApiProperty({
    example: '2024-11-24T21:15:05.938Z',
    description: 'Timestamp of the transaction',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'List of purchased products with details',
    type: [ValidatedProductDto],
  })
  validatedProducts: ValidatedProductDto[];

  @ApiProperty({
    example: 50,
    description: 'Total cost of the purchased products',
  })
  totalCost: number;

  @ApiProperty({
    example: 100,
    description: 'Total amount paid by the customer',
  })
  totalPaid: number;

  @ApiProperty({
    example: [
      {
        denomination: 50,
        quantity: 1,
      },
      {
        denomination: 20,
        quantity: 1,
      },
    ],
    description: 'Change returned to the customer',
    type: [ChangeItemDto],
  })
  change: ChangeItemDto[];
}
