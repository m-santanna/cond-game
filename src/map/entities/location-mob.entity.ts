import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Location } from './location.entity';
import { MobDefinition } from './mob-definition.entity';

@Entity('location_mobs')
@Index(['locationId'])
export class LocationMob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'location_id' })
  locationId: string;

  @ManyToOne(() => Location, (location) => location.mobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ name: 'mob_definition_id' })
  mobDefinitionId: string;

  @ManyToOne(() => MobDefinition, { eager: true })
  @JoinColumn({ name: 'mob_definition_id' })
  mobDefinition: MobDefinition;

  @Column()
  quantity: number;

  constructor(partial: Partial<LocationMob>) {
    Object.assign(this, partial);
  }
}
