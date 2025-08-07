import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File, Folder, FileCreationAttributes } from '../../models';
import * as path from 'path';
import * as fs from 'fs/promises';
import { transformDatesInObject } from '../../utils/dateUtils';

@Injectable()
export class FileService {
  private readonly uploadPath = './uploads';

  constructor(
    @InjectModel(File)
    private fileModel: typeof File,
    @InjectModel(Folder)
    private folderModel: typeof Folder,
  ) {}

  async uploadFile(file: Express.Multer.File, folderId: number | null): Promise<File> {
    // Проверяем папку только если folderId передан
    if (folderId !== null) {
      const folder = await this.folderModel.findByPk(folderId);
      if (!folder) {
        throw new Error(`Folder with ID ${folderId} not found`);
      }
    }

    // Создаем директорию uploads если её нет
    await this.ensureUploadDirectoryExists();

    // Генерируем уникальное имя файла
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, fileName);

    // Сохраняем файл на диск
    await fs.writeFile(filePath, file.buffer);

    // Сохраняем метаданные в базу данных
    const fileData: FileCreationAttributes = {
      name: file.originalname,
      filePath: filePath,
      mimeType: file.mimetype,
      fileSize: file.size,
      folderId: folderId,
    };
    
    const savedFile = await this.fileModel.create(fileData);

    return transformDatesInObject(savedFile.toJSON());
  }

  async getFilesByFolder(folderId: number): Promise<File[]> {
    const files = await this.fileModel.findAll({
      where: { folderId },
      include: [
        {
          model: Folder,
          as: 'folder',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return files.map(file => transformDatesInObject(file.toJSON()));
  }

  async getFileById(id: number): Promise<File> {
    const file = await this.fileModel.findByPk(id, {
      include: [
        {
          model: Folder,
          as: 'folder',
        },
      ],
    });

    if (!file) {
      throw new Error(`File with ID ${id} not found`);
    }

    return transformDatesInObject(file.toJSON());
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.fileModel.findByPk(id);
    
    if (!file) {
      throw new Error(`File with ID ${id} not found`);
    }
    
    try {
      await fs.unlink(file.filePath);
    } catch (error) {
      console.warn(`Could not delete file from disk: ${file.filePath}`, error);
    }

    await file.destroy();
  }

  async getAllFiles(): Promise<File[]> {
    const files = await this.fileModel.findAll({
      include: [
        {
          model: Folder,
          as: 'folder',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return files.map(file => transformDatesInObject(file.toJSON()));
  }

  async getAllFilesWithFolders(): Promise<File[]> {
    const files = await this.fileModel.findAll({
      include: [
        {
          model: Folder,
          as: 'folder',
          attributes: ['id', 'name', 'createdAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return files.map(file => transformDatesInObject(file.toJSON()));
  }

  async getFileContent(id: number): Promise<Buffer> {
    const file = await this.getFileById(id);
    
    try {
      return await fs.readFile(file.filePath);
    } catch (error) {
      throw new Error(`Could not read file: ${error.message}`);
    }
  }

  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }
}
