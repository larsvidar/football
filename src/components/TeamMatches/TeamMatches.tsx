/***** IMPORTS *****/
import {useRouter} from 'next/router';
import {FC, useEffect, useState} from 'react';
import {IMatch} from 'types/matches';
import {Fetcher} from 'utils/Fetcher';
import {addZero} from 'utils/utils';
import styles from './TeamMatches.module.scss';


/***** COMPONENT *****/
export const TeamMatches: FC = (): JSX.Element => {

	/*** Variables ***/
	const fetcher = new Fetcher();
	const router = useRouter();

	/*** State ***/
	const [matches, setMatches] = useState<IMatch[] | null | undefined>();


	/*** Effects ***/

	/**
	 * Runs when team-state updates
	 * 	- Fetches team-matches
	 */
	useEffect(() => {
		const teamId = router.query.team;
		if(teamId) fetchTeam(teamId as string);
	}, [router]);



	/*** Functions ***/
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
					{matches === null && <tr><td>Ingen data funnet ...</td></tr>}
					{!matches && <tr><td>... henter lag-data</td></tr>}
					{matches?.map((match) => {
						return (
							<tr key={match.id}>
								<td>{match.title}</td>
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
