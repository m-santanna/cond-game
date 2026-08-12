import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class OpenChestDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  chestKey: string;

  @IsString()
  @IsNotEmpty()
  difficultyProfileKey: string;
}
