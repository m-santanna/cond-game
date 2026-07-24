import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { EquipmentDefinition } from './equipment-definition.entity';
import { EquipmentCondition } from '../enums/equipment-condition.enum';

@Entity('equipment')
@Index(['inventoryId'])
@Index(['definitionId'])
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'inventory_id' })
  inventoryId: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.equipment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @Column({ name: 'definition_id' })
  definitionId: string;

  @ManyToOne(() => EquipmentDefinition, { eager: true })
  @JoinColumn({ name: 'definition_id' })
  definition: EquipmentDefinition;

  @Column()
  tier: number;

  @Column()
  power: number;

  @Column({ type: 'enum', enum: EquipmentCondition })
  condition: EquipmentCondition;

  constructor(partial: Partial<Equipment>) {
    Object.assign(this, partial);
  }
}
