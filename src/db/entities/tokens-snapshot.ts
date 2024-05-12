import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tokens_snapshots')
export class TokensSnapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'token_address' })
  tokenAddress: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  volume: number;

  @Column('decimal')
  liquidity: number;

  @Column()
  pair: string;

  @Column({ name: 'pair_type' })
  pairType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
