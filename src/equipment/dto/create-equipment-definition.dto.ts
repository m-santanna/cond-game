import { IsString, IsNotEmpty, IsEnum, IsArray } from 'class-validator';
import { EquipmentSlot } from '../enums/equipment-slot.enum';
import { EquipmentType } from '../enums/equipment-type.enum';

export class CreateEquipmentDefinitionDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(EquipmentSlot)
  slot: EquipmentSlot;

  @IsEnum(EquipmentType)
  type: EquipmentType;

  @IsArray()
  @IsString({ each: true })
  cards: string[];
}
