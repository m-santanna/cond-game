import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChestDefinitionDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
