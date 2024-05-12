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

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group: number;

  @Column({ name: 'bet_id' })
  betId: string;

  @CreateDateColumn({ name: 'user_id' })
  userId: number;

  @UpdateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Bet, (bet) => bet.votes)
  @JoinColumn({ name: 'bet_id', referencedColumnName: 'id' })
  bet: Bet;

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
