import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class InventoryResponseDto {
  @ApiProperty({
    example: '67437b2faeab5770e16ae9b3',
    description: 'The unique ID of the inventory item',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    example: 'banknote',
    description: 'The type of the item (e.g., coin or banknote)',
  })
  @Expose()
  type: string;

  @ApiProperty({
    example: 1000,
    description:
      'The denomination of the item (e.g., value of coin or banknote)',
  })
  @Expose()
  denomination: number;

  @ApiProperty({
    example: 10,
    description: 'The quantity of the item in stock',
  })
  @Expose()
  quantity: number;

  @Exclude() // Exclude __v property from the response
  __v?: number;
}
