import type { Repository } from 'typeorm';

import { AppDataSource } from '..';
import { User } from '../entities';
import { BetStatuses } from '../enums';

export class UsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  public async findOrCreateByWalletAddress(walletAddress: string) {
    const user = await this.repository.findOneBy({ walletAddress });

    if (user) {
      return user;
    }

    const newUser = this.repository.create({
      walletAddress,
    });

    return this.repository.save(newUser);
  }

  public async findById(id: number) {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.bets', 'bets', 'bets.status IN (:...statuses)', {
        statuses: [BetStatuses.Approved, BetStatuses.Closed],
      })
      .leftJoinAndSelect('user.betEntries', 'betEntries')
      .leftJoinAndSelect('betEntries.bet', 'bet')
      .leftJoinAndSelect('betEntries.betEntryResults', 'betEntryResult')
      .leftJoinAndSelect('betEntryResult.result', 'result')
      .where('user.id = :id', { id })
      .getOne();
  }
}
