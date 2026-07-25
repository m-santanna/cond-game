import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChestDefinitionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
