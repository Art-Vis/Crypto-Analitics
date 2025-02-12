import axios from 'axios';

export const fetchKlines = async (
	symbol: string = 'btcusdt',
	interval: string = '1m',
	limit: number = 50
) => {
	const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
	const { data } = await axios.get(url);

	return data.map((candle: any) => ({
		time: new Date(candle[0]).toLocaleTimeString(),
		open: parseFloat(candle[1]),
		high: parseFloat(candle[2]),
		low: parseFloat(candle[3]),
		close: parseFloat(candle[4]),
	}));
};
