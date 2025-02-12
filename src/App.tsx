import PriceChart from './components/PriceChart';
import './App.css';
import { FC, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

const App: FC = () => {
	useEffect(() => {
		WebApp.ready(); // Сообщаем Telegram, что приложение загружено
		WebApp.expand(); // Разворачиваем Web App на весь экран
		WebApp.MainButton.setText('Открыть приложение');
		WebApp.MainButton.show();
		WebApp.MainButton.onClick(() => {
			'https://t.me/cryptoart_analytics_bot/crypto_analytics';
		});
	}, []);
	return (
		<div className='container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light py-4'>
			<h1 className='text-center fw-bold mb-4'>Криптовалютный Анализ!</h1>
			<div className='w-100'>
				<PriceChart />
			</div>
		</div>
	);
};

export default App;
