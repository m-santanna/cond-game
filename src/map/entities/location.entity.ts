import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { GameMap } from './game-map.entity';
import { LocationDefinition } from './location-definition.entity';
import { LocationMob } from './location-mob.entity';

@Entity('locations')
@Index(['mapId', 'q', 'r'], { unique: true })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'map_id' })
  mapId: number;

  @ManyToOne(() => GameMap, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'map_id' })
  map: GameMap;

  @Column({ name: 'definition_id' })
  definitionId: string;

  @ManyToOne(() => LocationDefinition, { eager: true })
  @JoinColumn({ name: 'definition_id' })
  definition: LocationDefinition;

  @Column()
  q: number;

  @Column()
  r: number;

  // Scales loot quantity only; loot type comes from the definition
  @Column()
  difficulty: number;

  @OneToMany(() => LocationMob, (mob) => mob.location, { cascade: true })
  mobs: LocationMob[];

  constructor(partial: Partial<Location>) {
    Object.assign(this, partial);
  }
}
