import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn()
  hash: string;

  @Column({ name: 'from_address' })
  fromAddress: string;

  @Column({ name: 'to_address' })
  toAddress: string;

  @Column('decimal')
  value: number;

  @Column({ type: 'decimal', name: 'gas_price' })
  gasPrice: bigint | number;

  @Column({ name: 'gas_used', type: 'integer' })
  gasUsed: bigint | number;

  @Column({ name: 'block_number' })
  blockNumber: number;

  @Column({ name: 'transaction_index' })
  transactionIndex: number;

  @Column('timestamp')
  timestamp: Date;
}
