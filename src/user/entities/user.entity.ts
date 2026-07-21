import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, name: 'user_id' })
  @Index()
  userId: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}