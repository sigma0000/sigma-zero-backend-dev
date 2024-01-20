import logger from '@/utils/logger';

const coinGeckoAPIEndpoints = {
  tokenPrice: '/simple/price',
  coinsList: '/coins/list',
  coinData: '/coins/',
};

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
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
};

class TokenService {
  private coinGeckoAPIUrl;
  private coinGeckoAPIKey;

  constructor(coingeckoAPIUrl: string, coingeckoAPIKey: string) {
    this.coinGeckoAPIUrl = coingeckoAPIUrl;
    this.coinGeckoAPIKey = coingeckoAPIKey;
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
}

export default TokenService;
