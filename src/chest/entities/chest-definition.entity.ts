import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chest_definitions')
export class ChestDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column({ unique: true })
  name: string;

  constructor(partial: Partial<ChestDefinition>) {
    Object.assign(this, partial);
  }
}
