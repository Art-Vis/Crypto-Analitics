import { useEffect, useState } from 'react';

const useBinanceSocket = (symbol: string = 'btcusdt') => {
	const [price, setPrice] = useState<string | null>(null);

	useEffect(() => {
		const ws = new WebSocket(
			`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
		);

		ws.onmessage = event => {
			const data = JSON.parse(event.data);
			setPrice(data.p);
		};

		return () => ws.close();
	}, [symbol]);

	return price;
};

export default useBinanceSocket;
