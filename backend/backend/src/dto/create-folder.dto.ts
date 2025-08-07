import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
