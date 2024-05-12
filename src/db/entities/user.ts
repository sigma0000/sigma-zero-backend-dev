import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { Bet } from './bet';
import { BetEntry } from './bet-entry';
import { Comment } from './comment';
import { reduceToken } from '@/helpers/reduce-token';
import { Vote } from './vote';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'wallet_address' })
  walletAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Bet, (bet) => bet.originator)
  bets: Bet[];

  @OneToMany(() => BetEntry, (betEntry) => betEntry.user)
  betEntries: BetEntry[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  walletReduced: string;

  @AfterLoad()
  reduceWallet() {
    this.walletReduced = reduceToken(this.walletAddress, [0, 5], 4);
  }
}
