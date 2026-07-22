import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Equipment } from '../../equipment/entities/equipment.entity';

@Entity('inventories')
@Index(['userId'], { unique: true })
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Equipment, (equipment) => equipment.inventory, {
    cascade: true,
  })
  equipment: Equipment[];

  constructor(partial: Partial<Inventory>) {
    Object.assign(this, partial);
  }
}
