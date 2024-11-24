import { Test, TestingModule } from '@nestjs/testing';
import { MachineInventoryController } from './machine-inventory.controller';

describe('MachineInventoryController', () => {
  let controller: MachineInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineInventoryController],
    }).compile();

    controller = module.get<MachineInventoryController>(MachineInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
