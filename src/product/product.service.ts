import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './../schemas/product.schema';
import { SortOrder } from 'mongoose'; // Import SortOrder type for clarity

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  // Get all products

  async findAll(
    page: number = 1,
    limit: number = 10,
    sort: string = 'name', // Default sort field
    order: 'asc' | 'desc' = 'asc', // Default sort order
  ): Promise<{
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: Product[];
  }> {
    const skip = (page - 1) * limit;

    // Fetch total number of items
    const totalItems = await this.productModel.countDocuments().exec();

    // Build sort object
    const sortOrder: SortOrder = order === 'asc' ? 1 : -1; // Explicitly typed
    const sortObject: { [key: string]: SortOrder } = { [sort]: sortOrder };

    // Fetch paginated and sorted items
    const items = await this.productModel
      .find()
      .sort(sortObject) // Pass the correctly typed sort object
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

  // Get a product by ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // Update a product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
      })
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Delete a product
  async remove(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async count(): Promise<number> {
    return this.productModel.countDocuments();
  }
}
