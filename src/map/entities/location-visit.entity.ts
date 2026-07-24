import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Location } from './location.entity';

@Entity('location_visits')
@Index(['userId', 'locationId'], { unique: true })
export class LocationVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'location_id' })
  locationId: string;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column()
  count: number;

  constructor(partial: Partial<LocationVisit>) {
    Object.assign(this, partial);
  }
}
