import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { EquipmentType } from '../enums/equipment-type.enum';

export class CreateEquipmentDefinitionDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(EquipmentType)
  type: EquipmentType;
}
