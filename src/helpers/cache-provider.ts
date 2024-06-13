import { createClient, type RedisClientType } from 'redis';

export class CacheProvider {
  private static instance: CacheProvider;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient({
      password: process.env.REDISPASSWORD,
      socket: {
        host: process.env.REDISHOST,
        port: Number(process.env.REDISPORT),
      },
    });
  }

  public static getInstance() {
    if (!CacheProvider.instance) {
      CacheProvider.instance = new CacheProvider();
    }

    return CacheProvider.instance;
  }

  public async connect() {
    await this.client.connect();
  }

  public async set(
    key: string,
    value: string | Record<string, unknown>,
    TTL = 3600,
  ) {
    if (typeof value === 'string') {
      await this.client.set(key, value, {
        EX: TTL,
      });
      return;
    }

    await this.client.set(key, JSON.stringify(value), {
      EX: TTL,
    });
  }

  public get(key: string) {
    return this.client.get(key);
  }

  public exists(key: string | string[]) {
    return this.client.exists(key);
  }
}
