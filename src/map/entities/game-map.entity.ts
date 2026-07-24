import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('maps')
export class GameMap {
  // Integer id doubles as progression order: map 1, 2, 3...
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  constructor(partial: Partial<GameMap>) {
    Object.assign(this, partial);
  }
}
