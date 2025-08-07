import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { FolderService } from '../../service/folder/folder.service';
import { CreateFolderDto } from '../../dto/create-folder.dto';

@Controller('api/folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  async createFolder(@Body() createFolderDto: CreateFolderDto) {
    try {
      const folder = await this.folderService.createFolder(createFolderDto);
      return {
        success: true,
        data: folder,
        message: 'Folder created successfully',
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

  @Get()
  async getAllFolders() {
    try {
      const folders = await this.folderService.getAllFolders();
      return {
        success: true,
        data: folders,
        message: 'Folders retrieved successfully',
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

  @Get(':id')
  async getFolderById(@Param('id', ParseIntPipe) id: number) {
    try {
      const folder = await this.folderService.getFolderById(id);
      return {
        success: true,
        data: folder,
        message: 'Folder retrieved successfully',
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

  @Put(':id')
  async updateFolder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateFolderDto>,
  ) {
    try {
      const folder = await this.folderService.updateFolder(id, updateData);
      return {
        success: true,
        data: folder,
        message: 'Folder updated successfully',
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

  @Delete(':id')
  async deleteFolder(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.folderService.deleteFolder(id);
      return {
        success: true,
        message: 'Folder deleted successfully',
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
