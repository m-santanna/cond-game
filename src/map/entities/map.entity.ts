import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('maps')
export class Map {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  // How many locations are generated for this map every week. Validated on
  // creation to never exceed the number of location definitions, which is safe
  // because definitions are never deleted.
  @Column({ type: 'int' })
  size: number;

  constructor(partial: Partial<Map>) {
    Object.assign(this, partial);
  }
}
