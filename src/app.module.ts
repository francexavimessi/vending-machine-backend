import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'schemas/product.schema';
import { MachineInventorySchema } from 'schemas/machineInventory.schema';
import { ProductService } from './product/product.service';
import { MachineInventoryService } from './machine-inventory/machine-inventory.service';
import { ProductController } from './product/product.controller';
import { MachineInventoryController } from './machine-inventory/machine-inventory.controller';
import { TransactionSchema } from 'schemas/transaction.schema';
import { VendingMachineController } from './vending-machine/vending-machine.controller';
import { VendingMachineService } from './vending-machine/vending-machine.service';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    // MongooseModule.forRoot(
    //   'mongodb://root:example@localhost:27017/vendingdb?authSource=admin',
    //   {
    //     dbName: 'vendingdb',
    //   },
    // ),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: 'vendingdb',
    }),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: 'MachineInventory', schema: MachineInventorySchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),

    ImagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [
    AppController,
    VendingMachineController,
    ProductController,
    MachineInventoryController,
  ],
  providers: [
    AppService,
    VendingMachineService,
    ProductService,
    MachineInventoryService,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private readonly productService: ProductService,
    private readonly machineInventoryService: MachineInventoryService,
  ) {}

  async onModuleInit() {
    this.logger.log('Database connection initialized');
    await this.initializeData();
  }

  private async initializeData() {
    // Initial Products
    const initialProducts = [
      // Snacks
      {
        name: 'Lay Origin',
        price: 20,
        stock: 100,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Pringles Original',
        price: 35,
        stock: 80,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Doritos Nacho',
        price: 25,
        stock: 70,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Oreo Cookies',
        price: 15,
        stock: 50,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'KitKat Bar',
        price: 10,
        stock: 60,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Snickers Bar',
        price: 20,
        stock: 55,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Cheetos Puffs',
        price: 30,
        stock: 40,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Mars Bar',
        price: 25,
        stock: 30,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Twix Bar',
        price: 25,
        stock: 45,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Ritz Crackers',
        price: 20,
        stock: 65,
        kind: 'snack',
        img: 'fruit-2.jpeg',
      },
      // Drinks
      {
        name: 'Coca-Cola',
        price: 15,
        stock: 80,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Pepsi',
        price: 15,
        stock: 70,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Sprite',
        price: 15,
        stock: 60,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Fanta Orange',
        price: 15,
        stock: 55,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Mountain Dew',
        price: 15,
        stock: 50,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: '7Up',
        price: 15,
        stock: 70,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Gatorade',
        price: 20,
        stock: 40,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Red Bull',
        price: 30,
        stock: 35,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Lipton Ice Tea',
        price: 20,
        stock: 50,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
      {
        name: 'Nestlé Water',
        price: 5,
        stock: 100,
        kind: 'drink',
        img: 'fruit-2.jpeg',
      },
    ];

    // Initial Machine Inventory
    const initialMachineInventory = [
      { denomination: 1, quantity: 100, type: 'coin' },
      { denomination: 5, quantity: 100, type: 'coin' },
      { denomination: 10, quantity: 100, type: 'coin' },
      { denomination: 20, quantity: 50, type: 'banknote' },
      { denomination: 50, quantity: 50, type: 'banknote' },
      { denomination: 100, quantity: 50, type: 'banknote' },
      { denomination: 500, quantity: 10, type: 'banknote' },
      { denomination: 1000, quantity: 10, type: 'banknote' },
    ];

    // Check if Product collection is empty
    const productCount = await this.productService.count();
    if (productCount === 0) {
      this.logger.log('No products found. Initializing default products...');
      for (const product of initialProducts) {
        await this.productService.create(product);
      }
    }

    // Check if Machine Inventory collection is empty
    const machineInventoryCount = await this.machineInventoryService.count();
    if (machineInventoryCount === 0) {
      this.logger.log(
        'No machine inventory found. Initializing default inventory...',
      );
      for (const inventory of initialMachineInventory) {
        await this.machineInventoryService.create(inventory);
      }
    }
  }
}
