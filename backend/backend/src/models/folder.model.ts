import { Column, Model, Table, DataType, PrimaryKey, AutoIncrement, HasMany, CreatedAt } from 'sequelize-typescript';
import { File } from './file.model';

export interface FolderCreationAttributes {
  name: string;
}

@Table({
  tableName: 'folders',
  timestamps: true,
})
export class Folder extends Model<Folder, FolderCreationAttributes> {
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

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;

  @HasMany(() => File)
  files: File[];
}
