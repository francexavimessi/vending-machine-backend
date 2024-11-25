import { Test, TestingModule } from '@nestjs/testing';
// import { InventoryService } from './inventory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import {
  MachineInventory,
  MachineInventorySchema,
} from './../schemas/machineInventory.schema';
import { MachineInventoryService } from './machine-inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';

describe('InventoryService', () => {
  let service: MachineInventoryService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let inventoryModel: Model<MachineInventory>;

  // Before the tests, connect to the in-memory database
  beforeAll(async () => {
    // Start MongoDB in memory once
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log(uri);

    mongoConnection = (await connect(uri)).connection;
    inventoryModel = mongoConnection.model(MachineInventory.name, MachineInventorySchema);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachineInventoryService,
        { provide: getModelToken(MachineInventory.name), useValue: inventoryModel },
      ],
    }).compile();

    service = module.get<MachineInventoryService>(MachineInventoryService);
  });

  afterEach(async () => {
    // Clear data between tests
    await inventoryModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ************* Create Inventory Item ************* //
  describe('create', () => {
    it('should create an inventory item', async () => {
      const createDto: CreateInventoryDto = {
        denomination: 1000,
        quantity: 10,
        type: 'coin',
      };

      const inventoryItem = await service.create(createDto);

      expect(inventoryItem).toHaveProperty('_id');
      expect(inventoryItem.denomination).toBe(1000);
      expect(inventoryItem.quantity).toBe(10);
      expect(inventoryItem.type).toBe('coin');
    });
  });

  // ************* Find All Inventory Items ************* //
  describe('findAll', () => {
    it('should find all inventory items', async () => {
      await inventoryModel.create({
        denomination: 1000,
        quantity: 10,
        type: 'coin',
      });

      await inventoryModel.create({
        denomination: 500,
        quantity: 20,
        type: 'banknote',
      });

      const inventoryItems = await service.findAll();
      expect(inventoryItems.length).toBe(2);
      expect(inventoryItems[0].denomination).toBe(1000);
      expect(inventoryItems[1].type).toBe('banknote');
    });
  });

  // ************* Find One Inventory Item ************* //
  describe('findOne', () => {
    it('should find an inventory item by ID', async () => {
      const inventoryItem = await inventoryModel.create({
        denomination: 1000,
        quantity: 10,
        type: 'coin',
      });

      const foundItem = await service.findOne(inventoryItem._id.toString());
      expect(foundItem.denomination).toBe(1000);
      expect(foundItem.quantity).toBe(10);
      expect(foundItem.type).toBe('coin');
    });

    it('should throw NotFoundException if inventory item is not found', async () => {
      await expect(
        service.findOne(new Types.ObjectId().toString()),
      ).rejects.toThrow();
    });
  });

  // ************* Update Inventory Item ************* //
  describe('update', () => {
    it('should update an inventory item', async () => {
      const inventoryItem = await inventoryModel.create({
        denomination: 1000,
        quantity: 10,
        type: 'coin',
      });

      const updatedItem = await service.update(inventoryItem._id.toString(), {
        quantity: 20,
      });

      expect(updatedItem.quantity).toBe(20);
    });

    it('should throw NotFoundException if inventory item is not found', async () => {
      await expect(
        service.update(new Types.ObjectId().toString(), {
          quantity: 5,
        }),
      ).rejects.toThrow();
    });
  });

  // ************* Remove Inventory Item ************* //
  describe('remove', () => {
    it('should remove an inventory item', async () => {
      const inventoryItem = await inventoryModel.create({
        denomination: 1000,
        quantity: 10,
        type: 'coin',
      });

      await service.remove(inventoryItem._id.toString());

      const foundItem = await inventoryModel.findById(inventoryItem._id);
      expect(foundItem).toBeNull();
    });

    it('should throw NotFoundException if inventory item is not found', async () => {
      await expect(
        service.remove(new Types.ObjectId().toString()),
      ).rejects.toThrow();
    });
  });
});
