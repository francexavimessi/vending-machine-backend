import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MachineInventoryService } from './machine-inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryResponseDto } from './dto/reponse-inventory.dto';
import { MachineInventory } from './../schemas/machineInventory.schema';

@ApiTags('Machine Inventory')
@Controller('inventory')
export class MachineInventoryController {
  constructor(private readonly inventoryService: MachineInventoryService) {}

  @Post()
  @ApiBody({ type: CreateInventoryDto })
  @ApiResponse({
    status: 201,
    description: 'Inventory successfully created.',
    type: InventoryResponseDto,
  })
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get paginated inventory items.',
    schema: {
      example: {
        totalItems: 50,
        totalPages: 5,
        currentPage: 1,
        items: [
          {
            _id: '6744dfc43b25965395bf838b',
            type: 'coin',
            denomination: 2,
            quantity: 3,
          },
        ],
      },
    },
  })
  async findAll(
    @Query('page') page: number = 1, // Defaults to page 1
    @Query('limit') limit: number = 10, // Defaults to 10 items per page
  ): Promise<{
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: MachineInventory[];
  }> {
    return this.inventoryService.findAllWithPagination(page, limit);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a specific inventory item by ID.',
    type: InventoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found.' })
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateInventoryDto })
  @ApiResponse({
    status: 200,
    description: 'Inventory item successfully updated.',
    type: InventoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Inventory item successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found.' })
  async remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
