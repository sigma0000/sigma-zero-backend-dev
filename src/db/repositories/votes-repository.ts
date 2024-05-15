import type { DeepPartial, Repository } from 'typeorm';
import { AppDataSource } from '..';

import { Vote } from '../entities/vote';

export class VotesRepository {
  private repository: Repository<Vote>;

  constructor() {
    this.repository = AppDataSource.getRepository(Vote);
  }

  public findByUserIdAndBetId(userId: number, betId: string) {
    return this.repository.find({
      select: ['id'],
      where: {
        userId,
        betId,
      },
    });
  }

  public save(data: DeepPartial<Vote>) {
    const vote = this.repository.create(data);

    return this.repository.save(vote);
  }
}
