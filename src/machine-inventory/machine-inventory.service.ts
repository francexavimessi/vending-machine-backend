import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { MachineInventory } from './schemas/machine-inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { MachineInventory } from './../schemas/machineInventory.schema';

@Injectable()
export class MachineInventoryService {
  constructor(
    @InjectModel(MachineInventory.name)
    private readonly inventoryModel: Model<MachineInventory>,
  ) {}

  // Create a new inventory item
  async create(
    createInventoryDto: CreateInventoryDto,
  ): Promise<MachineInventory> {
    const createdInventory = new this.inventoryModel(createInventoryDto);
    return createdInventory.save();
  }

  // Get all inventory items
  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: MachineInventory[];
  }> {
    const skip = (page - 1) * limit;

    // Fetch total number of items
    const totalItems = await this.inventoryModel.countDocuments().exec();

    // Fetch paginated items
    const items = await this.inventoryModel
      .find()
      .sort({ denomination: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    return {
      totalItems,
      totalPages,
      currentPage: page,
      items,
    };
  }

  // Get an inventory item by ID
  async findOne(id: string): Promise<MachineInventory> {
    const inventory = await this.inventoryModel.findById(id).exec();
    if (!inventory) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return inventory;
  }

  // Update an inventory item
  async update(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<MachineInventory> {
    const inventory = await this.inventoryModel
      .findByIdAndUpdate(id, updateInventoryDto, {
        new: true,
      })
      .exec();

    if (!inventory) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    return inventory;
  }

  // Delete an inventory item
  async remove(id: string): Promise<void> {
    const result = await this.inventoryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
  }

  async count(): Promise<number> {
    return this.inventoryModel.countDocuments();
  }
  // async create(data: Partial<MachineInventory>) {
  //   const inventory = new this.inventoryModel(data);
  //   return inventory.save();
  // }
}
