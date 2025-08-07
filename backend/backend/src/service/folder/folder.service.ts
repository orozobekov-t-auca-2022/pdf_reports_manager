import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder, File, FolderCreationAttributes } from '../../models';
import { CreateFolderDto } from '../../dto/create-folder.dto';
import { transformDatesInObject } from '../../utils/dateUtils';

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder)
    private folderModel: typeof Folder,
  ) {}

  async createFolder(createFolderDto: CreateFolderDto): Promise<Folder> {
    const folderData: FolderCreationAttributes = {
      name: createFolderDto.name,
    };
    const folder = await this.folderModel.create(folderData);
    return transformDatesInObject(folder.toJSON());
  }

  async getAllFolders(): Promise<Folder[]> {
    const folders = await this.folderModel.findAll({
      include: [
        {
          model: File,
          as: 'files',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // дд/мм/гггг
    return folders.map(folder => transformDatesInObject(folder.toJSON()));
  }

  async getFolderById(id: number): Promise<Folder> {
    const folder = await this.folderModel.findByPk(id, {
      include: [
        {
          model: File,
          as: 'files',
        },
      ],
    });

    if (!folder) {
      throw new Error(`Folder with ID ${id} not found`);
    }

    return transformDatesInObject(folder.toJSON());
  }

  async updateFolder(id: number, updateData: Partial<CreateFolderDto>): Promise<Folder> {
    const folder = await this.folderModel.findByPk(id);
    if (!folder) {
      throw new Error(`Folder with ID ${id} not found`);
    }
    
    const updatedFolder = await folder.update(updateData);
    return transformDatesInObject(updatedFolder.toJSON());
  }

  async deleteFolder(id: number): Promise<void> {
    const folder = await this.getFolderById(id);
    await folder.destroy();
  }
}
