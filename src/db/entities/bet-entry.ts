import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { User, Bet, Transaction, BetEntryResult } from './';

@Entity('bet_entries')
export class BetEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.betEntries)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'bet_id' })
  betId: string;

  @ManyToOne(() => Bet)
  @JoinColumn({ name: 'bet_id' })
  bet: Bet;

  @Column({ type: 'decimal', name: 'amount_eth' })
  amountEth: bigint;

  @Column('smallint')
  group: number;

  @Column({ name: 'transaction_hash' })
  transactionHash: string;

  @ManyToOne(() => Transaction, { cascade: true })
  @JoinColumn({ name: 'transaction_hash' })
  transaction: Transaction;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BetEntryResult, (betEntryResult) => betEntryResult.betEntry)
  betEntryResults: BetEntryResult[];
}
