/***** IMPORTS *****/
import {Tournament} from 'components/Tournament/Tournament';
import type {GetServerSideProps, NextPage} from 'next';
import {IMatch} from 'types/matches';
import {ITournament} from 'types/tournament';
import {ServerFetcher} from 'utils/server/ServerFetcher';
import {getDates} from 'utils/utils';


/***** TYPES *****/
export interface IPropType  {
	tournament?: ITournament | null,
	matches?: IMatch[] | null,
}


/***** COMPONENT *****/
const Home: NextPage<IPropType> = (props) => {
	return (
		<Tournament data={props} />
	);
};


/**
 * Server-side-functions
 * Fetches data for server-side rendering.
 * @returns {genObject}
 */
export const getServerSideProps: GetServerSideProps = async ({query}) => {
	const props: IPropType = {};
	const fetcher = new ServerFetcher();

	//Fetches tournament-data
	const tournament = await fetcher.getTournament();
	if(!(tournament instanceof Error)) props.tournament = tournament;
	
	//Fetches team-matches, if team id is defined.
	const teamId = query.team as string;
	if(teamId) {
		const {fromDate, toDate} = getDates();
		const matches = await fetcher.getTeamMatches(teamId, fromDate, toDate);
		if(!(matches instanceof Error)) props.matches = matches;
	}

	return {props};
};


/***** EXPORTS *****/
export default Home;
