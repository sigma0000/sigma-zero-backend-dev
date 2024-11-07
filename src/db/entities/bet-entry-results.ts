import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Result, BetEntry, Transaction } from './';

@Entity('bet_entry_results')
export class BetEntryResult {
  @PrimaryColumn({ name: 'result_id' })
  resultId: number;

  @PrimaryColumn({ name: 'bet_entry_id' })
  betEntryId: number;

  @ManyToOne(() => Result)
  @JoinColumn({ name: 'result_id' })
  result: Result;

  @ManyToOne(() => BetEntry, (betEntry) => betEntry.betEntryResults)
  @JoinColumn({ name: 'bet_entry_id' })
  betEntry: BetEntry;

  @Column({ name: 'amount_eth', type: 'decimal' })
  amountEth: number;

  @Column({ name: 'transaction_hash' })
  transactionHash: string;

  @ManyToOne(() => Transaction, { cascade: true })
  @JoinColumn({ name: 'transaction_hash' })
  transaction: Transaction;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}