import TokenService from '@/services/token';
import CacheProvider from './cache-provider';

class TokenCache {
  private cacheProvider: CacheProvider;
  private TTL = Number(process.env.TOKEN_DATA_CACHE_MAX_TTL_SECONDS || 3600);

  constructor() {
    this.cacheProvider = CacheProvider.getInstance();
  }

  public async set(
    id: string,
    tokenData: Exclude<
      Awaited<ReturnType<TokenService['getTokenData']>>,
      undefined
    >,
  ) {
    await this.cacheProvider.set(`token:${id}`, tokenData, this.TTL);
  }

  public async get(id: string) {
    const data = await this.cacheProvider.get(`token:${id}`);

    if (data) {
      return JSON.parse(data);
    }

    return data;
  }

  public async exists(id: string) {
    return this.cacheProvider.exists(`token:${id}`);
  }
}

export default TokenCache;
