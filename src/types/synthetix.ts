export interface SyntheticAsset {
  id: string
  name: string
  symbol: string
  category: 'crypto' | 'commodity' | 'forex' | 'stock' | 'rwa'
  icon: string
  price: number
  change24h: number
  marketCap: number
  volume: number
  mintAmount: number
  liquidity?: number
  description?: string
  oracleSource?: string
  fee?: number
  lastUpdated?: string
} 