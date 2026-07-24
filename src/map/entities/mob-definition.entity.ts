import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('mob_definitions')
export class MobDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  @Index()
  difficulty: number;

  @Column()
  health: number;

  @Column()
  attack: number;

  @Column()
  defense: number;

  constructor(partial: Partial<MobDefinition>) {
    Object.assign(this, partial);
  }
}
