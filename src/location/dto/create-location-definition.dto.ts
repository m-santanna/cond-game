import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLocationDefinitionDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  chestDefinitionId: string;
}
