import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { EquipmentType } from '../enums/equipment-type.enum';

@Entity('equipment_definitions')
export class EquipmentDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: EquipmentType })
  @Index()
  type: EquipmentType;

  constructor(partial: Partial<EquipmentDefinition>) {
    Object.assign(this, partial);
  }
}
