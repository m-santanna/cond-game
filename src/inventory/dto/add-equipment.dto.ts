import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { EquipmentQuality } from '../../equipment/enums/equipment-quality.enum';

export class AddEquipmentDto {
  @IsUUID()
  @IsNotEmpty()
  definitionId: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  tier?: number = 1;

  @IsEnum(EquipmentQuality)
  @IsOptional()
  quality?: EquipmentQuality = EquipmentQuality.COMMON;
}
