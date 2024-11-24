import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    example: 10,
    description: 'Denomination of the coin or banknote',
  })
  @IsNumber()
  @IsPositive()
  denomination: number;

  @ApiProperty({ example: 100, description: 'Quantity of the denomination' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 'coin', description: 'coin or banknote' })
  @IsString()
  type: string;
}
