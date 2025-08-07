import {Controller,Get,Post,Delete,Param,Query,HttpException,HttpStatus,ParseIntPipe,UseInterceptors,UploadedFile,Response} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response as ExpressResponse } from 'express';
import { FileService } from '../../service/file/file.service';

@Controller('api/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folderId', ParseIntPipe) folderId: number,
  ) {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const savedFile = await this.fileService.uploadFile(file, folderId);
      return {
        success: true,
        data: savedFile,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('dates')
  async getAllFilesWithFolders() {
    try {
      const files = await this.fileService.getAllFilesWithFolders();
      return {
        success: true,
        data: files,
        message: 'Files with folder information retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllFiles() {
    try {
      const files = await this.fileService.getAllFiles();
      return {
        success: true,
        data: files,
        message: 'Files retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('folder/:folderId')
  async getFilesByFolder(@Param('folderId', ParseIntPipe) folderId: number) {
    try {
      const files = await this.fileService.getFilesByFolder(folderId);
      return {
        success: true,
        data: files,
        message: 'Files retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':id')
  async getFileById(@Param('id', ParseIntPipe) id: number) {
    try {
      const file = await this.fileService.getFileById(id);
      return {
        success: true,
        data: file,
        message: 'File retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':id/download')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Response() res: ExpressResponse,
  ) {
    try {
      const file = await this.fileService.getFileById(id);
      const fileContent = await this.fileService.getFileContent(id);

      res.setHeader('Content-Type', file.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
      res.send(fileContent);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.fileService.deleteFile(id);
      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
