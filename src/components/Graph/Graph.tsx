import { FC } from 'react';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface DataGraphProps {
	close: number;
	ema: number;
	high: number;
	low: number;
	open: number;
	rsi: number;
	sma: number;
	time: string;
}

interface CandlestickGraphProps {
	data: DataGraphProps[];
}

interface LineGraphProps {
	data: DataGraphProps[];
	selectedIndicators: string[];
}

export const CandlestickGraph: FC<CandlestickGraphProps> = ({ data }) => (
	<div className='chart-container border rounded p-3 bg-white shadow mb-3'>
		<ResponsiveContainer width='100%' height={300}>
			<ComposedChart data={data}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='time' />
				<YAxis domain={['auto', 'auto']} />
				<Tooltip />
				<Bar dataKey='open' fill='green' />
				<Bar dataKey='close' fill='red' />
			</ComposedChart>
		</ResponsiveContainer>
	</div>
);

const indicatorColors: Record<string, string> = {
	SMA: '#ff7300',
	EMA: '#387908',
	RSI: '#ff0000',
};

export const LineGraph: FC<LineGraphProps> = ({ data, selectedIndicators }) => (
	<div className='chart-container border rounded p-3 bg-white shadow'>
		<ResponsiveContainer width='100%' height={300}>
			<LineChart data={data}>
				<XAxis dataKey='time' />
				<YAxis domain={['auto', 'auto']} />
				<Tooltip />
				<Line
					type='monotone'
					dataKey='close'
					stroke='#8884d8'
					strokeWidth={2}
				/>
				{selectedIndicators.map(indicator => (
					<Line
						key={indicator}
						type='monotone'
						dataKey={indicator.toLowerCase()} // Преобразуем в lowercase для соответствия ключам в data
						stroke={indicatorColors[indicator]} // Динамически выбираем цвет
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	</div>
);
