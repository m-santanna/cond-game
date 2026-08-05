import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChestDefinition } from '../../chest/entities/chest-definition.entity';

@Entity('location_definitions')
export class LocationDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'chest_definition_id' })
  chestDefinitionId: string;

  @ManyToOne(() => ChestDefinition, { eager: true })
  @JoinColumn({ name: 'chest_definition_id' })
  chestDefinition: ChestDefinition;

  constructor(partial: Partial<LocationDefinition>) {
    Object.assign(this, partial);
  }
}
