/***** IMPORTS *****/
import {useRouter} from 'next/router';
import {FC, useEffect, useState} from 'react';
import {IMatch} from 'types/matches';
import {Fetcher} from 'utils/Fetcher';
import {getTeamSlug} from 'utils/formatters';
import {addZero} from 'utils/utils';
import styles from './TeamMatches.module.scss';


/***** TYPES *****/
interface ITeamMatchesProps {
	data?: IMatch[] | null,
}


/***** COMPONENT *****/
export const TeamMatches: FC<ITeamMatchesProps> = ({data}): JSX.Element => {

	/*** Variables ***/
	const fetcher = new Fetcher();
	const router = useRouter();
	const teamId = router.query.team as string;
	const UPDATE_INTERVAL = 60 * 1000; //60 seconds

	/*** State ***/
	const [matches, setMatches] = useState<IMatch[] | null | undefined>(data);


	/*** Effects ***/

	/**
	 * Runs once
	 * 	- Sets up interval for refetching data.
	 */
	useEffect(() => {
		const interval = setInterval(() => fetchTeam(teamId), UPDATE_INTERVAL);
		return () => {
			clearInterval(interval);
		};
	}, []);


	/**
	 * Runs when team-state updates
	 * 	- Fetches team-matches
	 */
	useEffect(() => {
		if(teamId) fetchTeam(teamId as string);
	}, [router]);



	/*** Functions ***/

	/**
	 * Fetches current teams title from teams-array
	 * 	- Finds correct team based on team-id from url-params.
	 * @returns {string} Team-title, or empty string.
	 */
	function getTeamTitle(): string {
		const teamId = router.query.team;
		if(!teamId || !matches?.length) return '';

		const team = matches[0].teams.find((team) => team.id === teamId);
		if(!team) return '';

		return team.title;
	}


	/**
	 * Fetches array of team matches.
	 * @param {string} teamId Id of team to get matches for.
	 * @returns {void} Sets matches to state.
	 */
	const fetchTeam = async (teamId: string): Promise<void> => {
		const now = new Date();
		const year = now.getFullYear();
		const month = addZero(now.getMonth() + 1);
		const day = addZero(now.getDate());
		const fromDate = `${year}-${month}-${day}`;
		const toDate = `${year + 2}-${month}-${day}`;
		
		const teamMatches = await fetcher.getTeamMatches(teamId, fromDate, toDate);
		if(teamMatches instanceof Error) {
			setMatches(null);
			return console.log(teamMatches.message);
		}

		setMatches(teamMatches);
	};


	/*** Return JSX ***/
	return (
		<div className={styles.TeamMatches}>
			<p className={styles.goBack} onClick={(): void => {router.push('');}}>Gå tilbake</p>
			<h2>Kommende kamper for {getTeamTitle()}</h2>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Kamp</th>
						<th></th>
						<th>Liga</th>
						<th>Kampdato</th>
						<th>Kamptid</th>
					</tr>
				</thead>
				<tbody>
					{(matches === null || !matches?.length) && <tr><td>Ingen data funnet ...</td></tr>}
					{!matches && <tr><td>... henter lag-data</td></tr>}
					{matches?.map((match) => {
						const teamsSlug = match.title.split('-');
						const homeTeam = getTeamSlug(undefined, teamsSlug[0]);
						const awayTeam = getTeamSlug(undefined, teamsSlug[1]);
	
						return (
							<tr key={match.id}>
								<td>{homeTeam} - {awayTeam}</td>
								<td></td>
								<td>{match.tournament}</td>
								<td>{match.startDate}</td>
								<td>{match.startTime}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
