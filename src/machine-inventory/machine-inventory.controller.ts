import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MachineInventoryService } from './machine-inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@ApiTags('Machine Inventory')
@Controller('inventory')
export class MachineInventoryController {
  constructor(private readonly inventoryService: MachineInventoryService) {}

  @Post()
  @ApiBody({ type: CreateInventoryDto })
  @ApiResponse({ status: 201, description: 'Inventory successfully created.' })
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all inventory items.' })
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a specific inventory item by ID.',
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
