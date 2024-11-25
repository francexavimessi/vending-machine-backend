import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@schemas/product.schema';
// import { Product, ProductSchema } from './dto/Product';

describe('ProductService', () => {
  let service: ProductService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let productModel: Model<Product>;

  beforeEach(async () => {
    // Start MongoDB in memory
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    mongoConnection = (await connect(uri)).connection;
    productModel = mongoConnection.model(Product.name, ProductSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getModelToken(Product.name), useValue: productModel },
        { provide: getModelToken(Product.name), useValue: Product },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    // Clear data after each test
    await productModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ************* Create Product ************* //
  describe('create', () => {
    it('should create a product', async () => {
      const product = await service.create({
        name: 'Test Product',
        price: 100,
        stock: 10,
        kind: 'snack',
      });

      expect(product).toHaveProperty('_id');
      expect(product.name).toBe('Test Product');
      expect(product.price).toBe(100);
      expect(product.stock).toBe(10);
    });
  });

  // ************* Find All Products ************* //
  describe('findAll', () => {
    it('should find all products', async () => {
      await productModel.create({
        name: 'Test Product',
        price: 100,
        stock: 10,
        kind: 'snack',
      });

      const products = await service.findAll();
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Test Product');
    });
  });

  // ************* Find One Product ************* //
  describe('findOne', () => {
    it('should find a product by ID', async () => {
      const product = await productModel.create({
        name: 'Test Product',
        price: 100,
        stock: 10,
        kind: 'snack',
      });

      const foundProduct = await service.findOne(product._id.toString());
      expect(foundProduct.name).toBe('Test Product');
    });

    it('should throw NotFoundException if product is not found', async () => {
      await expect(
        service.findOne(new Types.ObjectId().toString()),
      ).rejects.toThrow();
    });
  });

  // ************* Update Product ************* //
  describe('update', () => {
    it('should update a product', async () => {
      const product = await productModel.create({
        name: 'Test Product',
        price: 100,
        stock: 10,
        kind: 'snack',
      });

      const updatedProduct = await service.update(product._id.toString(), {
        name: 'Updated Product',
      });

      expect(updatedProduct.name).toBe('Updated Product');
    });

    it('should throw NotFoundException if product is not found', async () => {
      await expect(
        service.update(new Types.ObjectId().toString(), {
          name: 'Non-existent Product',
        }),
      ).rejects.toThrow();
    });
  });

  // ************* Remove Product ************* //
  describe('remove', () => {
    it('should remove a product', async () => {
      const product = await productModel.create({
        name: 'Test Product',
        price: 100,
        stock: 10,
        kind: 'snack',
      });

      await service.remove(product._id.toString());

      const foundProduct = await productModel.findById(product._id);
      expect(foundProduct).toBeNull();
    });

    it('should throw NotFoundException if product is not found', async () => {
      await expect(
        service.remove(new Types.ObjectId().toString()),
      ).rejects.toThrow();
    });
  });
});
