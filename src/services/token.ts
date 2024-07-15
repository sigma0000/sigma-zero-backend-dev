import logger from '@/utils/logger';

const coinGeckoAPIEndpoints = {
  tokenPrice: '/simple/price',
  coinsList: '/coins/list',
  coinData: '/coins/',
};

export interface Ticker {
  base: string;
  target: string;
  market: Market;
  last: number;
  volume: number;
  converted_last: ConvertedLast;
  converted_volume: ConvertedVolume;
  trust_score: string | null;
  bid_ask_spread_percentage: number;
  timestamp: string;
  last_traded_at: string;
  last_fetch_at: string;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url: string;
  token_info_url: string | null;
  coin_id: string;
  target_coin_id: string;
}

export interface Market {
  name: string;
  identifier: string;
  has_trading_incentive: boolean;
}

export interface ConvertedLast {
  btc: number;
  eth: number;
  usd: number;
}

export interface ConvertedVolume {
  btc: number;
  eth: number;
  usd: number;
}

export type TokenData = {
  id: string;
  symbol: string;
  name: string;
  web_slug: string;
  categories: string[];
  country_origin: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_data: MarketData;
  tickers: Ticker[];
};

export type MarketData = {
  current_price: { [key: string]: number };
  total_value_locked: null;
  mcap_to_tvl_ratio: null;
  fdv_to_tvl_ratio: null;
  roi: Roi;
  ath: { [key: string]: number };
  ath_change_percentage: { [key: string]: number };
  ath_date: { [key: string]: Date };
  atl: { [key: string]: number };
  atl_change_percentage: { [key: string]: number };
  atl_date: { [key: string]: Date };
  market_cap: { [key: string]: number };
  market_cap_rank: number;
  fully_diluted_valuation: { [key: string]: number };
  market_cap_fdv_ratio: number;
  total_volume: { [key: string]: number };
  high_24h: { [key: string]: number };
  low_24h: { [key: string]: number };
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  price_change_24h_in_currency: { [key: string]: number };
  price_change_percentage_1h_in_currency: { [key: string]: number };
  price_change_percentage_24h_in_currency: { [key: string]: number };
  price_change_percentage_7d_in_currency: { [key: string]: number };
  price_change_percentage_14d_in_currency: { [key: string]: number };
  price_change_percentage_30d_in_currency: { [key: string]: number };
  price_change_percentage_60d_in_currency: { [key: string]: number };
  price_change_percentage_200d_in_currency: { [key: string]: number };
  price_change_percentage_1y_in_currency: { [key: string]: number };
  market_cap_change_24h_in_currency: { [key: string]: number };
  market_cap_change_percentage_24h_in_currency: { [key: string]: number };
  total_supply: number;
  max_supply: null;
  circulating_supply: number;
  last_updated: Date;
};

export type Roi = {
  times: number;
  currency: string;
  percentage: number;
};

type CoinData = {
  id: string;
  symbol: string;
  name: string;
  platforms?: Record<string, string>;
};

const { COINGECKO_API_URL, COINGECKO_API_KEY } = process.env;

export class TokenService {
  private coinGeckoAPIUrl;
  private coinGeckoAPIKey;

  constructor() {
    this.coinGeckoAPIUrl = COINGECKO_API_URL;
    this.coinGeckoAPIKey = COINGECKO_API_KEY;
  }

  public async getCoinsList() {
    try {
      const response = await fetch(
        `${this.coinGeckoAPIUrl}${coinGeckoAPIEndpoints.coinsList}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = (await response.json()) as CoinData[];

      return data;
    } catch (e) {
      logger.error(e);
    }
  }

  public async getCoinsListEthereum() {
    const params = new URLSearchParams({
      include_platform: String(true),
    });

    try {
      const response = await fetch(
        `${this.coinGeckoAPIUrl}${coinGeckoAPIEndpoints.coinsList}?${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = (await response.json()) as CoinData[];

      return data.filter((item) => item.platforms?.ethereum);
    } catch (e) {
      logger.error(e);
    }
  }

  public async getTokenData(tokenId: string) {
    try {
      const response = await fetch(
        `${this.coinGeckoAPIUrl}${coinGeckoAPIEndpoints.coinData}${tokenId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = (await response.json()) as TokenData;

      return data;
    } catch (e) {
      logger.error(e);
    }
  }

  public async getTokenDataByAddress(tokenId: string, tokenAddress: string) {
    try {
      const response = await fetch(
        `${this.coinGeckoAPIUrl}${coinGeckoAPIEndpoints.coinData}${tokenId}/contract/${tokenAddress}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = (await response.json()) as TokenData;

      return data;
    } catch (e) {
      logger.error(e);
    }
  }
}
