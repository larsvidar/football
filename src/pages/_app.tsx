/***** IMPORTS *****/
import '../styles/globals.scss';
import type {AppProps} from 'next/app';
import Head from 'next/head';


/***** COMPONENT *****/
function MyApp({Component, pageProps}: AppProps): JSX.Element {
	return (<>
		<Head>
			<title>Football</title>
			<link rel="icon" type="image/x-icon" href="/images/favicon.ico"></link>
		</Head>
		<Component {...pageProps} />
	</>);
}


/***** EXPORTS *****/
export default MyApp;
