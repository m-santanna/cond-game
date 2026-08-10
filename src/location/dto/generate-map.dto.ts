import { IsNotEmpty, IsUUID } from 'class-validator';

export class GenerateMapDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
