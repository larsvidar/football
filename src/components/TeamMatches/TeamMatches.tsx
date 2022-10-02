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

export const TeamMatches: FC<ITeamMatchesProps> = ({teamState}) => {

	const fetcher = new Fetcher();
	const [team, setTeam] = teamState;
	const [matches, setMatches] = useState<IMatch[] | null>(null);


	useEffect(() => {
		fetchTeam(team.id);
	}, [team]);


	/**
	 * 
	 */
	const fetchTeam = async (teamId: string) => {
		const now = new Date();
		const year = now.getFullYear();
		const fromDate = (year - 1) + '-01-01';
		const toDate = (year + 2) + '-01-01';
		
		const teamMatches = fetcher.getTeamMatches(teamId, fromDate, toDate);
		if(teamMatches instanceof Error) return console.log(teamMatches.message);

		setMatches(formatMatches(teamMatches));
	};

	console.log(matches);
	return (
		<div className={styles.TeamMatches}>
			<p className={styles.goBack} onClick={() => setTeam(null)}>Gå tilbake</p>
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