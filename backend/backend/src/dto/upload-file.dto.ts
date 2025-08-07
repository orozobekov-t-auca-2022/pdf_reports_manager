import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UploadFileDto {
  @IsNumber()
  @IsNotEmpty()
  folderId: number;

  @IsString()
  @IsOptional()
  description?: string;
}
