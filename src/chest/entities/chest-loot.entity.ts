import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ChestDefinition } from './chest-definition.entity';
import { ChestLootType } from '../enums/chest-loot-type.enum';

@Entity('chest_loot')
export class ChestLoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chest_definition_id' })
  @Index()
  chestDefinitionId: string;

  @ManyToOne(() => ChestDefinition, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chest_definition_id' })
  chestDefinition: ChestDefinition;

  @Column({ type: 'enum', enum: ChestLootType })
  type: ChestLootType;

  @Column({ name: 'definition_id' })
  definitionId: string;

  @Column({ type: 'decimal' })
  weight: number;

  @Column({ name: 'min_amount', type: 'int' })
  minAmount: number;

  @Column({ name: 'max_amount', type: 'int' })
  maxAmount: number;

  constructor(partial: Partial<ChestLoot>) {
    Object.assign(this, partial);
  }
}
