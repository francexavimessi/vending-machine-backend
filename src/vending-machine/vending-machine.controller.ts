import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VendingMachineService } from './vending-machine.service';
import { PurchaseRequestDto } from './dto/purchase-request.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';
import { ProductResponseDto } from 'src/product/dto/response-product.dto';
@ApiTags('Vending Machine')
@Controller('vending-machine')
export class VendingMachineController {
  constructor(private readonly vendingMachineService: VendingMachineService) {}

  @Get('products')
  @ApiResponse({
    status: 200,
    description: 'Fetch all available products',
    isArray: true,
    type: ProductResponseDto,
  })
  async getProducts() {
    return this.vendingMachineService.getProducts();
  }

  @Post('purchase')
  @ApiBody({ type: PurchaseRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Successful purchase of products',
    type: PurchaseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or insufficient funds',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async purchaseProducts(
    @Body() purchaseRequest: PurchaseRequestDto,
  ): Promise<PurchaseResponseDto> {
    const { products, totalPaid, denominations } = purchaseRequest;

    try {
      return await this.vendingMachineService.purchaseProducts(
        products,
        totalPaid,
        denominations,
      );
    } catch (error) {
      // Handle known error types
      console.log(error);

      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message, details: '' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Fallback for unexpected errors
      throw new HttpException(
        { message: 'Internal server error', details: '' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
