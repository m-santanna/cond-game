import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ChestDefinition } from '../../chest/entities/chest-definition.entity';

// Location definitions are intentionally append-only: MapService validates
// `map.size <= count(location_definitions)` once at map creation and relies on
// that count never shrinking. Adding a delete path means re-checking every map.
@Entity('location_definitions')
export class LocationDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'chest_definition_id' })
  @Index()
  chestDefinitionId: string;

  @ManyToOne(() => ChestDefinition, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'chest_definition_id' })
  chestDefinition: ChestDefinition;

  constructor(partial: Partial<LocationDefinition>) {
    Object.assign(this, partial);
  }
}
