import { useEffect, useState } from 'react';
import { fetchKlines } from '../services/binanceAPI';
import { CRYPTO_PAIRS } from '../constants/cryptos';
import { SMA, EMA, RSI } from 'technicalindicators';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CandlestickGraph, LineGraph } from './Graph/Graph';

const INTERVALS = ['1m', '3m', '5m'];

const PriceChart: React.FC = () => {
	const [symbol, setSymbol] = useState('btcusdt'); // исходная пара
	const [interval, setIntervalState] = useState('1m'); // состояние для интервала
	const [data, setData] = useState<any[]>([]);
	console.log('data:', data);
	const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]); // выбранный индикатор на графике
	const [alertsHistory, setAlertsHistory] = useState<
		{ time: string; message: string }[]
	>([]);
	const [graphType, setGraphType] = useState<'candlestick' | 'line'>(
		(localStorage.getItem('graph') as 'candlestick' | 'line') || 'candlestick'
	); // отображение графика

	useEffect(() => {
		const fetchData = async () => {
			const candles = await fetchKlines(symbol, interval);
			const processedData = processIndicators(candles);
			setData(processedData);
			checkPriceJump(processedData);
		};

		fetchData();

		const updateInterval = setInterval(fetchData, 5000);
		return () => clearInterval(updateInterval);
	}, [symbol, interval, selectedIndicators]);

	const processIndicators = (candles: any[]) => {
		if (!candles.length) return [];

		const closePrices = candles.map(c => c.close);
		const indicatorsData: any = { sma: [], ema: [], rsi: [] };

		if (selectedIndicators.includes('SMA')) {
			indicatorsData.sma = SMA.calculate({ period: 14, values: closePrices });
		}

		if (selectedIndicators.includes('EMA')) {
			indicatorsData.ema = EMA.calculate({ period: 14, values: closePrices });
		}

		if (selectedIndicators.includes('RSI')) {
			indicatorsData.rsi = RSI.calculate({ period: 14, values: closePrices });
		}

		return candles.map((c, index) => ({
			...c,
			sma: indicatorsData.sma[index] || null,
			ema: indicatorsData.ema[index] || null,
			rsi: indicatorsData.rsi[index] || null,
		}));
	};

	const checkPriceJump = (data: any[]) => {
		if (data.length < 10) return;
		const last = data[data.length - 1];
		const prev = data[data.length - 10];
		const priceChange = ((last.close - prev.close) / prev.close) * 100;

		if (Math.abs(priceChange) > 2) {
			const message = `Резкий скачок цены: ${priceChange.toFixed(2)}%`;
			toast.warning(message);
			setAlertsHistory(prev => [
				{ time: last.time, message },
				...prev.slice(0, 9),
			]);
		}
	};

	const toggleIndicator = (indicator: string) => {
		setSelectedIndicators(prev =>
			prev.includes(indicator)
				? prev.filter(i => i !== indicator)
				: [...prev, indicator]
		);
	};

	const changeInterval = (newInterval: string) => {
		setIntervalState(newInterval);
	};

	const toggleGraphType = () => {
		setGraphType(prev => {
			const newGraphType = prev === 'candlestick' ? 'line' : 'candlestick';
			localStorage.setItem('graph', newGraphType);
			return newGraphType;
		});
	};

	return (
		<div className='container mt-4'>
			<h2 className='text-center mb-3'>График цены</h2>

			<select
				className='form-select mb-3'
				value={symbol}
				onChange={e => setSymbol(e.target.value)}
			>
				{CRYPTO_PAIRS.map(crypto => (
					<option key={crypto.value} value={crypto.value}>
						{crypto.label}
					</option>
				))}
			</select>

			{/* Выбор индикаторов */}
			<div className='d-flex gap-5 mb-3'>
				<div>
					<div className='form-check'>
						<input
							type='checkbox'
							className='form-check-input'
							checked={selectedIndicators.includes('SMA')}
							onChange={() => toggleIndicator('SMA')}
						/>
						<label className='form-check-label'>SMA (14)</label>
					</div>
					<div className='form-check'>
						<input
							type='checkbox'
							className='form-check-input'
							checked={selectedIndicators.includes('EMA')}
							onChange={() => toggleIndicator('EMA')}
						/>
						<label className='form-check-label'>EMA (14)</label>
					</div>
					<div className='form-check'>
						<input
							type='checkbox'
							className='form-check-input'
							checked={selectedIndicators.includes('RSI')}
							onChange={() => toggleIndicator('RSI')}
						/>
						<label className='form-check-label'>RSI (14)</label>
					</div>
				</div>
				<div>
					{INTERVALS.map(i => (
						<div key={i} className='form-check'>
							<input
								type='checkbox'
								className='form-check-input'
								name='interval'
								checked={interval === i}
								onChange={() => changeInterval(i)}
							/>
							<label className='form-check-label'>{i}</label>
						</div>
					))}
				</div>
			</div>
			<button onClick={toggleGraphType}>
				{graphType === 'candlestick'
					? 'Показать "Линейный график"'
					: 'Показать "График свечей"'}
			</button>
			{graphType === 'candlestick' ? (
				/* График свечей */
				<CandlestickGraph data={data} />
			) : (
				/* Линейный график */
				<LineGraph data={data} selectedIndicators={selectedIndicators} />
			)}

			{/* История уведомлений */}
			<div className='mt-4 border rounded p-3 bg-light shadow'>
				<h5>История уведомлений</h5>
				<ul className='list-group'>
					{alertsHistory.length === 0 ? (
						<li className='list-group-item text-muted'>Пока нет уведомлений</li>
					) : (
						alertsHistory.map((alert, index) => (
							<li key={index} className='list-group-item'>
								<b>{alert.time}</b>: {alert.message}
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
};

export default PriceChart;
