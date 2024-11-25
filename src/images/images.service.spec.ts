import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service'; // Adjust the path as necessary
import { join } from 'path';
import * as fs from 'fs'; // Import fs module
import { jest } from '@jest/globals'; // Import jest for mocking

describe('ImagesService', () => {
  let service: ImagesService;

  // Mock fs.existsSync and fs.mkdirSync
  // const mockExistsSync = jest.fn<boolean, [fs.PathLike]>(); // Specify the return type as boolean
  // const mockMkdirSync = jest.fn();

  beforeEach(async () => {
    // Mock fs.existsSync and fs.mkdirSync
    // jest.spyOn(fs, 'existsSync').mockImplementation(mockExistsSync);
    // jest.spyOn(fs, 'mkdirSync').mockImplementation(mockMkdirSync);

    // Create the module for testing
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks between tests
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test case for the getFilePath method
  describe('getFilePath', () => {
    it('should return the correct file path', () => {
      const fileName = 'test-image.jpg';
      const filePath = service.getFilePath(fileName);

      expect(filePath).toBe(
        join(__dirname, '..', '..', '..', 'public', 'uploads', fileName),
      );
    });
  });
});
