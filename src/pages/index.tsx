/***** IMPORTS *****/
import {Tournament} from 'components/Tournament/Tournament';
import type {NextPage} from 'next';
import {genObject} from 'types/general';
import {ServerFetcher} from 'utils/server/ServerFetcher';


/***** COMPONENT *****/
const Home: NextPage = (props: genObject) => {
	return (
		<Tournament data={props.data} />
	);
};


//SSR function
export const getServerSideProps = async (): Promise<any> => {
	const props: genObject = {};
	const fetcher = new ServerFetcher();
	const response = await fetcher.getTournament();
	console.log({response})
	if(response instanceof Error) return {props};
	props.data = response;
	return {props};
};


/***** EXPORTS *****/
export default Home;
