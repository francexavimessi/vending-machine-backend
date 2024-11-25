import { Test, TestingModule } from '@nestjs/testing';
import { VendingMachineService } from './vending-machine.service'; // Adjust path as necessary
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose'; // Import mongoose
import { getModelToken } from '@nestjs/mongoose';
import { Product, ProductSchema } from './../schemas/product.schema'; // Adjust path as necessary
import {
  Transaction,
  TransactionSchema,
} from './../schemas/transaction.schema'; // Adjust path as necessary
import {
  MachineInventory,
  MachineInventorySchema,
} from './../schemas/machineInventory.schema'; // Adjust path as necessary
import { PurchaseResponseDto } from './dto/purchase-response.dto'; // Adjust path as necessary

describe('VendingMachineService', () => {
  let service: VendingMachineService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let productModel: Model<Product>;
  let transactionModel: Model<Transaction>;
  let inventoryModel: Model<MachineInventory>;

  // Setup in-memory MongoDB before all tests
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    productModel = mongoConnection.model(Product.name, ProductSchema);
    transactionModel = mongoConnection.model(
      Transaction.name,
      TransactionSchema,
    );
    inventoryModel = mongoConnection.model(
      MachineInventory.name,
      MachineInventorySchema,
    );
  });

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [
    //     MongooseModule.forFeature([
    //       { name: Product.name, schema: ProductSchema },
    //       { name: Transaction.name, schema: TransactionSchema },
    //       { name: MachineInventory.name, schema: MachineInventorySchema },
    //     ]),
    //   ],
    //   providers: [VendingMachineService],
    // }).compile();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendingMachineService,
        { provide: getModelToken(Product.name), useValue: productModel },
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModel,
        },
        {
          provide: getModelToken(MachineInventory.name),
          useValue: inventoryModel,
        },
      ],
    }).compile();
    service = module.get<VendingMachineService>(VendingMachineService);
  });

  afterEach(async () => {
    // Clean up the data after each test
    await productModel.deleteMany({});
    await inventoryModel.deleteMany({});
    await transactionModel.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect and stop MongoMemoryServer after all tests
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //  Purchase Products  //
  describe('purchaseProducts', () => {
    it('should successfully purchase products and return the correct response', async () => {
      const product = await productModel.create({
        name: 'Soda Can',
        price: 20,
        stock: 10,
        kind: 'drink',
      });

      // Create (coins and banknotes)
      await inventoryModel.create({
        type: 'coin',
        denomination: 50,
        quantity: 10,
      });

      await inventoryModel.create({
        type: 'coin',
        denomination: 20,
        quantity: 5,
      });

      await inventoryModel.create({
        type: 'banknote',
        denomination: 100,
        quantity: 3,
      });

      // Define the purchase request
      const products = [{ productId: product._id.toString(), quantity: 3 }];
      const totalPaid = 100; // Total paid by the customer
      const denominations = [
        { value: 50, count: 1 }, // Denomination of 50, 1 coin
        { value: 20, count: 2 }, // Denomination of 20, 2 coins
      ];

      const purchaseResponse: PurchaseResponseDto =
        await service.purchaseProducts(products, totalPaid, denominations);

      // Assertions for the purchase response
      expect(purchaseResponse).toHaveProperty('transactionId');
      expect(purchaseResponse).toHaveProperty('timestamp');
      expect(purchaseResponse.validatedProducts.length).toBe(1); // One product being purchased
      expect(purchaseResponse.validatedProducts[0].productName).toBe(
        'Soda Can',
      );
      expect(purchaseResponse.totalCost).toBe(60); // 20 * 3 products (changed quantity)
      expect(purchaseResponse.totalPaid).toBe(100);
      expect(purchaseResponse.change.length).toBeGreaterThan(0); // Change should be returned

      // Check the amount of change returned and validate denominations
      const totalChange = purchaseResponse.change.reduce(
        (acc, item) => acc + item.denomination * item.quantity,
        0,
      );
      expect(totalChange).toBe(40); // 100 paid - 60 cost = 40 change
    });

    it('should throw an error if insufficient funds are provided', async () => {
      const product = await productModel.create({
        name: 'Soda Can',
        price: 20,
        stock: 10,
        kind: 'drink',
      });

      const products = [{ productId: product._id.toString(), quantity: 2 }];
      const totalPaid = 30; // Insufficient funds (need 40)
      const denominations = [
        { value: 50, count: 1 },
        { value: 20, count: 2 },
      ];

      await expect(
        service.purchaseProducts(products, totalPaid, denominations),
      ).rejects.toThrowError('Insufficient funds.');
    });

    it('should throw an error if products are not available in requested quantity', async () => {
      const product = await productModel.create({
        name: 'Soda Can',
        price: 20,
        stock: 5, // Only 5 available
        kind: 'drink',
      });

      const products = [{ productId: product._id.toString(), quantity: 10 }];
      const totalPaid = 100;
      const denominations = [
        { value: 50, count: 1 },
        { value: 20, count: 2 },
      ];

      await expect(
        service.purchaseProducts(products, totalPaid, denominations),
      ).rejects.toThrowError(
        `Product ${product.name} is not available in the requested quantity.`,
      );
    });
  });

  // ************* Calculate Change ************* //
  describe('calculateChange', () => {
    it('should return the correct change', async () => {
      await inventoryModel.create({
        type: 'banknote',
        denomination: 50,
        quantity: 5,
      });

      await inventoryModel.create({
        type: 'banknote',
        denomination: 20,
        quantity: 1,
      });
      await inventoryModel.create({
        type: 'coin',
        denomination: 10,
        quantity: 3,
      });
      const change = await service.calculateChange(90);
      console.log(change);

      expect(change).toEqual([
        { denomination: 50, quantity: 1 },
        { denomination: 20, quantity: 1 },
        { denomination: 10, quantity: 2 },
      ]);
    });

    it('should return null if change cannot be provided', async () => {
      const change = await service.calculateChange(500); // Large amount not available in inventory
      expect(change).toBeNull();
    });
  });

  // ************* Update Inventory for Denominations ************* //
  describe('increaseInventoryForDenominations', () => {
    it('should correctly update inventory when denominations are provided', async () => {
      const denominations = [
        { value: 50, count: 5 },
        { value: 20, count: 10 },
      ];

      await service.increaseInventoryForDenominations(denominations);

      const coin50 = await inventoryModel.findOne({ denomination: 50 });
      const coin20 = await inventoryModel.findOne({ denomination: 20 });

      expect(coin50.quantity).toBe(5);
      expect(coin20.quantity).toBe(10);
    });
  });
});
