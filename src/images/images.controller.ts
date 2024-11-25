import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImagesService } from './images.service';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './dist/public/uploads', // Directory for file storage
        filename: (req: any, file: any, callback: any) => {
          console.log(file.originalname);

          const uniqueSuffix = Date.now() + '-' + file.originalname;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.MulterFile) {
    console.log('Uploaded file:', file);
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      path: `/images/${file.filename}`,
    };
  }

  @Get(':fileName')
  getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      const filePath = this.imagesService.getFilePath(fileName);

      // Check if the file exists
      if (existsSync(filePath)) {
        return res.sendFile(filePath); // Send file to client
      } else {
        const defaultFilePath = this.imagesService.getFilePath('fruit-2.jpeg');
        return res.sendFile(defaultFilePath); // Send default file if the requested file doesn't exist
      }
    } catch (error) {
      const defaultFilePath = this.imagesService.getFilePath('fruit-2.jpeg');
      return res.sendFile(defaultFilePath); // Handle errors and send default file
    }
  }
}
