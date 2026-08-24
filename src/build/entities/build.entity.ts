import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Equipment } from '../../equipment/entities/equipment.entity';

@Entity('builds')
@Index(['inventoryId'])
export class Build {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'inventory_id', unique: true })
  inventoryId: string;

  @OneToOne(() => Inventory)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @Column({ nullable: true, name: 'weapon_id' })
  weaponId: string | null;

  @OneToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'weapon_id' })
  weapon: Equipment | null;

  @Column({ nullable: true, name: 'offhand_id' })
  offhandId: string | null;

  @OneToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'offhand_id' })
  offhand: Equipment | null;

  @Column({ nullable: true, name: 'helmet_id' })
  helmetId: string | null;

  @OneToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'helmet_id' })
  helmet: Equipment | null;

  @Column({ nullable: true, name: 'armor_id' })
  armorId: string | null;

  @OneToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'armor_id' })
  armor: Equipment | null;

  @Column({ nullable: true, name: 'boots_id' })
  bootsId: string | null;

  @OneToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'boots_id' })
  boots: Equipment | null;

  constructor(partial: Partial<Build>) {
    Object.assign(this, partial);
  }
}
