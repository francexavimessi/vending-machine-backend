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

export class PurchaseResponseDto {
  @ApiProperty({
    description: 'List of purchased products with details',
    example: [
      {
        productId: '64af72de9e2f9c4a8f2d9eaa',
        productName: 'Soda Can',
        quantity: 2,
        price: 15,
      },
    ],
  })
  validatedProducts: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];

  @ApiProperty({
    example: 50,
    description: 'Total cost of the purchased products',
  })
  totalCost: number;

  @ApiProperty({
    description: 'Change returned to the customer',
    type: [ChangeItemDto],
  })
  change: ChangeItemDto[];
}
