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
    const filePath = this.imagesService.getFilePath(fileName);
    return res.sendFile(filePath); // Send file to client
  }
}
