import { Column, Model, Table, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt } from 'sequelize-typescript';
import { Folder } from './folder.model';

export interface FileCreationAttributes {
  name: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  folderId: number;
}

@Table({
  tableName: 'files',
  timestamps: true,
})
export class File extends Model<File, FileCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'file_path',
  })
  filePath: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'mime_type',
  })
  mimeType: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'file_size',
  })
  fileSize: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;

  @ForeignKey(() => Folder)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'folder_id',
  })
  folderId: number;

  @BelongsTo(() => Folder)
  folder: Folder;
}
