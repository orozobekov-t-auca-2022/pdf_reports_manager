import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder, File, FolderCreationAttributes, FileCreationAttributes } from '../models';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Folder)
    private folderModel: typeof Folder,
    @InjectModel(File)
    private fileModel: typeof File,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    try {
      // Проверяем, есть ли уже данные
      const foldersCount = await this.folderModel.count();
      
      if (foldersCount > 0) {
        console.log('Database already has data, skipping seeding...');
        return;
      }

      console.log('Seeding database with mock data...');

      // Создаем папки
      const folderData1: FolderCreationAttributes = { name: 'Отчеты 2024' };
      const folder1 = await this.folderModel.create(folderData1);

      const folderData2: FolderCreationAttributes = { name: 'Документы проекта' };
      const folder2 = await this.folderModel.create(folderData2);

      const folderData3: FolderCreationAttributes = { name: 'Архив' };
      const folder3 = await this.folderModel.create(folderData3);

      // Создаем файлы (mock данные)
      const fileData1: FileCreationAttributes = {
        name: 'annual-report-2024.pdf',
        filePath: '/mock/annual-report-2024.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024000,
        folderId: folder1.id,
      };
      await this.fileModel.create(fileData1);

      const fileData2: FileCreationAttributes = {
        name: 'quarterly-summary.pdf',
        filePath: '/mock/quarterly-summary.pdf',
        mimeType: 'application/pdf',
        fileSize: 512000,
        folderId: folder1.id,
      };
      await this.fileModel.create(fileData2);

      const fileData3: FileCreationAttributes = {
        name: 'project-specification.pdf',
        filePath: '/mock/project-specification.pdf',
        mimeType: 'application/pdf',
        fileSize: 2048000,
        folderId: folder2.id,
      };
      await this.fileModel.create(fileData3);

      const fileData4: FileCreationAttributes = {
        name: 'user-manual.pdf',
        filePath: '/mock/user-manual.pdf',
        mimeType: 'application/pdf',
        fileSize: 756000,
        folderId: folder2.id,
      };
      await this.fileModel.create(fileData4);

      const fileData5: FileCreationAttributes = {
        name: 'old-report-2023.pdf',
        filePath: '/mock/old-report-2023.pdf',
        mimeType: 'application/pdf',
        fileSize: 890000,
        folderId: folder3.id,
      };
      await this.fileModel.create(fileData5);

      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}
