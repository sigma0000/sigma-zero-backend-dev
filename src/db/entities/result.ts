import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TokensSnapshot, Bet, Transaction } from './';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bet_id' })
  betId: string;

  @ManyToOne(() => Bet)
  @JoinColumn({ name: 'bet_id' })
  bet: Bet;

  @Column({ name: 'token_snapshot_id' })
  tokenSnapshotId: number;

  @ManyToOne(() => TokensSnapshot)
  @JoinColumn({ name: 'token_snapshot_id' })
  tokenSnapshot: TokensSnapshot;

  @Column({ name: 'winner_group' })
  winnerGroup: number;

  @Column({ name: 'transaction_hash' })
  transactionHash: string;

  @ManyToOne(() => Transaction, { cascade: true })
  @JoinColumn({ name: 'transaction_hash' })
  transaction: Transaction;

  @CreateDateColumn({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: 'now()' })
  updatedAt: Date;
}
