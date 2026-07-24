import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { EquipmentCondition } from '../../equipment/enums/equipment-condition.enum';

export class AddEquipmentDto {
  @IsUUID()
  @IsNotEmpty()
  definitionId: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  tier?: number = 1;

  @IsEnum(EquipmentCondition)
  @IsOptional()
  condition?: EquipmentCondition = EquipmentCondition.SOLID;
}
