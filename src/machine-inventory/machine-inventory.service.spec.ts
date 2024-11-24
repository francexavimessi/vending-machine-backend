import { Test, TestingModule } from '@nestjs/testing';
import { MachineInventoryService } from './machine-inventory.service';

describe('MachineInventoryService', () => {
  let service: MachineInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachineInventoryService],
    }).compile();

    service = module.get<MachineInventoryService>(MachineInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
