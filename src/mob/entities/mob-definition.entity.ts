import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mob_definitions')
export class MobDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int' })
  health: number;

  constructor(partial: Partial<MobDefinition>) {
    Object.assign(this, partial);
  }
}
