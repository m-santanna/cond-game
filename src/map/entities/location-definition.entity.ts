import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { LootType } from '../enums/loot-type.enum';

@Entity('location_definitions')
export class LocationDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'loot_type', type: 'enum', enum: LootType })
  @Index()
  lootType: LootType;

  constructor(partial: Partial<LocationDefinition>) {
    Object.assign(this, partial);
  }
}
