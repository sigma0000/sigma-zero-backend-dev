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

import { BetEntry, TokensSnapshot, Transaction, User } from './';
import { BetStatuses, BetTypes, WageringStyles } from '../enums';
import { BetTypeValues } from '@/constants/bet-type';
import { WageringStyleValues } from '@/constants/wagering-style';
import { Comment } from './comment';
import { Vote } from './vote';

@Entity('bets')
export class Bet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'token_snapshot_id' })
  tokenSnapshotId: number;

  @ManyToOne(() => TokensSnapshot, { cascade: true })
  @JoinColumn({ name: 'token_snapshot_id' })
  tokenSnapshot: TokensSnapshot;

  @OneToMany(() => BetEntry, (betEntry) => betEntry.bet)
  betEntries: BetEntry[];

  @Column({ name: 'contract_length' })
  duration: number;

  @Column({
    type: 'enum',
    enum: BetTypes,
    name: 'bet_type',
  })
  betType: BetTypeValues;

  @Column({
    type: 'enum',
    enum: BetStatuses,
    name: 'bet_status',
  })
  status: BetStatuses;

  @Column({
    type: 'enum',
    enum: WageringStyles,
    name: 'wagering_style',
  })
  wageringStyle: WageringStyleValues;

  @Column({ name: 'transaction_hash' })
  transactionHash: string;

  @ManyToOne(() => Transaction, { cascade: true })
  @JoinColumn({ name: 'transaction_hash' })
  transaction: Transaction;

  @Column({ name: 'originator_id' })
  originatorId: number;

  @ManyToOne(() => User, (user) => user.bets)
  @JoinColumn({ name: 'originator_id' })
  originator: User;

  @Column()
  index: number;

  @Column({ name: 'value', type: 'decimal' })
  value: bigint;

  @Column({ name: 'auxiliary_value' })
  auxiliaryValue: number;

  @Column()
  option: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @CreateDateColumn({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: 'now()' })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.bet)
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.bet)
  votes: Vote[];
}
