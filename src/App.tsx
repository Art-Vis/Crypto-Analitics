import PriceChart from './components/PriceChart';
import './App.css';
import { FC } from 'react';

const App: FC = () => {
	return (
		<div className='container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light py-4'>
			<h1 className='text-center fw-bold mb-4'>Криптовалютный Анализ</h1>
			<div className='w-100'>
				<PriceChart />
			</div>
		</div>
	);
};

export default App;
