import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChestLoot } from './chest-loot.entity';

@Entity('chest_definitions')
export class ChestDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ChestLoot, (chestLoot) => chestLoot.chestDefinition, {
    cascade: true,
  })
  loot: ChestLoot[];

  constructor(partial: Partial<ChestDefinition>) {
    Object.assign(this, partial);
  }
}
