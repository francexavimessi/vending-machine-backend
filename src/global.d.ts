declare namespace Express {
  export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
  }
  export interface Request {
    file?: MulterFile; // Single file upload
    files?: MulterFile[]; // Multiple file uploads
  }
}
