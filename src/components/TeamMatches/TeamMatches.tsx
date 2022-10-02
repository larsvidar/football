/***** IMPORTS *****/
import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {IMatch} from 'types/matches';
import {ITeam} from 'types/tournament';
import {Fetcher} from 'utils/Fetcher';
import {formatMatches} from 'utils/formatters';
import styles from './TeamMatches.module.scss';


/***** TYPES *****/
interface ITeamMatchesProps {
	teamState: [ITeam, Dispatch<SetStateAction<ITeam | null>>]
}


/***** COMPONENT *****/
export const TeamMatches: FC<ITeamMatchesProps> = ({teamState}): JSX.Element => {

	/*** Variables ***/
	const fetcher = new Fetcher();

	/*** State ***/
	const [team, setTeam] = teamState;
	const [matches, setMatches] = useState<IMatch[] | null>(null);


	/*** Effects ***/

	/**
	 * Runs when team-state updates
	 * 	- Fetches team-matches
	 */
	useEffect(() => {
		fetchTeam(team.id);
	}, [team]);


	/*** Functions ***/

	/**
	 * Fetches array of team matches.
	 * @param {string} teamId Id of team to get matches for.
	 * @returns {void} Sets matches to state.
	 */
	const fetchTeam = async (teamId: string): Promise<void> => {
		const now = new Date();
		const year = now.getFullYear();
		const fromDate = (year - 1) + '-01-01';
		const toDate = (year + 2) + '-01-01';
		
		const teamMatches = await fetcher.getTeamMatches(teamId, fromDate, toDate);
		if(teamMatches instanceof Error) return console.log(teamMatches.message);

		setMatches(formatMatches(teamMatches));
	};


	console.log(matches)
	/*** Return JSX ***/
	return (
		<div className={styles.TeamMatches}>
			<p className={styles.goBack} onClick={(): void => setTeam(null)}>Gå tilbake</p>
			<h2>Kamper for {team.title}</h2>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Kamp</th>
						<th>Kampdato</th>
						<th>Kamptid</th>
					</tr>
				</thead>
				<tbody>
					{!matches?.length && <tr><td>... henter lag-data</td></tr>}
					{matches?.map((match) => {
						return (
							<tr key={match.id}>
								<td>{match.title}</td>
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