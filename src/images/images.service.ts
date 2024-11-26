import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class ImagesService {
  private readonly uploadPath = join(
    __dirname,
    '..',
    '..',
    '..',
    'dist',
    'public',
    'uploads',
  );
  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getFilePath(fileName: string): string {
    // console.log(uploadPath);

    return join(this.uploadPath, fileName);
  }
}
