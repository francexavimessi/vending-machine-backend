import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class ImagesService {
  private readonly uploadPath = join(
    __dirname,
    '..',
    '..',
    'public',
    'uploads',
  );

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getFilePath(fileName: string): string {
    return join(this.uploadPath, fileName);
  }
}
