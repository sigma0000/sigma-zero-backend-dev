import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Bet } from './bet';
import { User } from './user';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ name: 'bet_id' })
  betId: string;

  @CreateDateColumn({ name: 'user_id' })
  userId: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @UpdateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Bet, (bet) => bet.comments)
  @JoinColumn({ name: 'bet_id', referencedColumnName: 'id' })
  bet: Bet;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
