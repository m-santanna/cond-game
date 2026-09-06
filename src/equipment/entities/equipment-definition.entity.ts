import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { EquipmentSlot } from '../enums/equipment-slot.enum';
import { EquipmentType } from '../enums/equipment-type.enum';

@Entity('equipment_definitions')
export class EquipmentDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: EquipmentSlot })
  @Index()
  slot: EquipmentSlot;

  @Column({ type: 'enum', enum: EquipmentType })
  @Index()
  type: EquipmentType;

  @Column('simple-array')
  cards: string[];

  constructor(partial: Partial<EquipmentDefinition>) {
    Object.assign(this, partial);
  }
}
