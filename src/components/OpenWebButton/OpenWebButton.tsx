import WebApp from '@twa-dev/sdk';

const OpenWebAppButton = () => {
	const openWebApp = () => {
		WebApp.openLink('https://t.me/cryptoart_analytics_bot/crypto_analytics');
	};

	return <button onClick={openWebApp}>Открыть Web App</button>;
};

export default OpenWebAppButton;
