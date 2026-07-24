import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LootType } from '../enums/loot-type.enum';

export class CreateLocationDefinitionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(LootType)
  lootType: LootType;
}
