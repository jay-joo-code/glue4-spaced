type AlpacaBar = {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: string;
  v: number;
  vw: number;
};

type AlpacaSymbol = {
  [symbol: string]: AlpacaBar[];
};

export interface AlpacaBarsData {
  bars: AlpacaSymbol;
  next_page_token: string | null;
}
