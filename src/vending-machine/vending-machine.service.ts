import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './../../schemas/product.schema';
import { Transaction } from './../../schemas/transaction.schema';
import { MachineInventory } from './../../schemas/machineInventory.schema';
import { PurchaseResponseDto } from './dto/purchase-response.dto';

@Injectable()
export class VendingMachineService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(MachineInventory.name)
    private inventoryModel: Model<MachineInventory>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async purchaseProducts(
    products: { productId: string; quantity: number }[],
    totalPaid: number,
    denominations: { value: number; count: number }[], // Add denominations parameter
  ) {
    // Fetch product details
    const productIds = products.map((item) => item.productId);
    const productDetails = await this.productModel.find({
      _id: { $in: productIds },
    });

    // Validate products and calculate total cost
    let totalCost = 0;
    const validatedProducts = products.map((item) => {
      const product = productDetails.find(
        (p) => p._id.toString() === item.productId,
      );
      if (!product || product.stock < item.quantity) {
        throw new Error(
          `Product ${product?.name || item.productId} is not available in the requested quantity.`,
        );
      }
      totalCost += product.price * item.quantity;
      return {
        productId: product._id.toString(),
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Check if sufficient funds are provided
    if (totalPaid < totalCost) {
      throw new Error('Insufficient funds.');
    }

    // Calculate change
    const changeNeeded = totalPaid - totalCost;
    const change = await this.calculateChange(changeNeeded);
    if (!change) {
      throw new Error('Not enough coins or banknotes for change.');
    }

    // Update product stocks
    for (const item of validatedProducts) {
      await this.productModel.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } },
      );
    }

    // Update inventory for change
    await this.updateInventoryForChange(change);

    // Update inventory for received denominations
    await this.increaseInventoryForDenominations(denominations);

    // Record transaction
    const transaction = new this.transactionModel({
      products: validatedProducts,
      totalPaid,
      changeReturned: change,
      status: 'completed',
    });
    const savedTransaction = await transaction.save();

    // Return structured response
    return {
      transactionId: savedTransaction._id.toString(),
      timestamp: savedTransaction.timestamp,
      validatedProducts,
      totalCost,
      totalPaid,
      change,
    } as PurchaseResponseDto;
  }

  private async calculateChange(
    amount: number,
  ): Promise<{ denomination: number; quantity: number }[] | null> {
    const inventory = await this.inventoryModel
      .find({ quantity: { $gt: 0 } })
      .sort({ denomination: -1 });
    const change = [];

    for (const item of inventory) {
      const needed = Math.floor(amount / item.denomination);
      const used = Math.min(needed, item.quantity);
      if (used > 0) {
        change.push({ denomination: item.denomination, quantity: used });
        amount -= used * item.denomination;
      }
      if (amount === 0) break;
    }
    return amount === 0 ? change : null;
  }

  private async updateInventoryForChange(
    change: { denomination: number; quantity: number }[],
  ): Promise<void> {
    for (const item of change) {
      await this.inventoryModel.updateOne(
        { denomination: item.denomination },
        { $inc: { quantity: -item.quantity } },
      );
    }
  }

  private async increaseInventoryForDenominations(
    denominations: { value: number; count: number }[],
  ): Promise<void> {
    for (const item of denominations) {
      await this.inventoryModel.updateOne(
        { denomination: item.value },
        { $inc: { quantity: item.count } },
        { upsert: true }, // Create the entry if it doesn't exist
      );
    }
  }
}
