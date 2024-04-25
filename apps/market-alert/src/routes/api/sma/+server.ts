import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ALPACA_API_KEY, ALPACA_API_SECRET } from '$env/static/private';
import { format, sub } from 'date-fns';
import type { AlpacaBarsData } from '$root/src/lib/types/alpaca.type';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const symbols = url.searchParams.get('symbols') ?? null;

  if (!symbols) error(400, 'Query param "symbols" not provided');

  const params = {
    symbols,
    timeframe: '1Day',
    start: sub(new Date(), { days: 70 }).toISOString()
  };
  const queryString = new URLSearchParams(params).toString();

  const response = await fetch(`https://data.alpaca.markets/v2/stocks/bars?${queryString}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'APCA-API-KEY-ID': ALPACA_API_KEY,
      'APCA-API-SECRET-KEY': ALPACA_API_SECRET
    }
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    error(400, `HTTP error ${response.status}: ${errorMessage}`);
  }

  const data: AlpacaBarsData = await response.json();

  const analysisBySymbol = Object.entries(data?.bars).map(([symbol, bars]) => {
    const latestClose = bars[bars.length - 1].c;
    const previousCloses = bars.slice(0, bars.length - 1).map((bar) => bar.c);
    const sma = previousCloses.reduce((acc, curr) => acc + curr, 0) / previousCloses.length;
    const status = latestClose > sma ? 'ABOVE' : 'BELOW';
    return {
      simple: `${symbol}:${status}`,
      verbose: `${symbol}:${status} ${latestClose.toFixed(2)} (SMA ${sma.toFixed(2)})`
    };
  });

  const analysisTitle = analysisBySymbol.map((analysis) => analysis.simple).join(' | ');
  const analysisDesc = analysisBySymbol.map((analysis) => analysis.verbose).join(' | ');

  return json({ success: true, analysisTitle, analysisDesc });
};
