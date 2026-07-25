import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ChestLootType } from '../enums/chest-loot-type.enum';

export class CreateChestLootDto {
  @IsString()
  @IsNotEmpty()
  chestDefinitionId: string;

  @IsEnum(ChestLootType)
  type: ChestLootType;

  @IsString()
  @IsNotEmpty()
  definitionId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  weight: number;

  @IsNumber()
  @Min(1)
  minAmount: number;

  @IsNumber()
  @Min(1)
  maxAmount: number;
}
