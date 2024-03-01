import type { DeepPartial, Repository } from 'typeorm';

import { AppDataSource } from '..';
import { Bet } from '../entities';
import { BetStatuses } from '../enums';

export class BetsRepository {
  private repository: Repository<Bet>;

  constructor() {
    this.repository = AppDataSource.getRepository(Bet);
  }

  public findAllWithStatusClose() {
    return this.repository.find({
      where: {
        status: BetStatuses.Close,
      },
      relations: {
        transaction: true,
      },
    });
  }

  public findAllWithStatusApproved() {
    return this.repository.find({
      where: {
        status: BetStatuses.Approved,
      },
      relations: {
        transaction: true,
      },
    });
  }

  public findByIndex(index: number) {
    return this.repository.findOneBy({ index });
  }

  public save(data: DeepPartial<Bet>) {
    const bet = this.repository.create(data);

    return this.repository.save(bet);
  }

  public async updateStatusByIndex(status: BetStatuses, index: number) {
    await this.repository.update({ index }, { status });
  }
}
