/***** IMPORTS *****/
import {useEffect, useState} from "react";
import {IMatch} from "types/matches";
import {formatMatches} from "utils/formatters";
import {config} from "utils/queries";
import styles from './TeamMatches.module.scss';

export const TeamMatches = ({teamState}: any) => {

	const [team, setTeam] = teamState;
	const [matches, setMatches] = useState<IMatch[] | null>(null);


	useEffect(() => {
		fetchTeam(team.id);
	}, [team]) //eslint-disable-line react-hooks/exhaustive-deps


	/**
	 * 
	 */
	const fetchTeam = async (teamId: string) => {
		const query = config.graphQL.queries.teamMatches.query;
		const variables = config.graphQL.queries.teamMatches.variables;
		const now = new Date();
		const year = now.getFullYear();
		console.log(year)
		variables.fromDate = (year - 1) + '-01-01';
		variables.toDate = (year + 2) + '-01-01'
		variables.participantId = teamId
		const body = {query, variables}

		if(matches?.length) return;
		const response: Response | Error = await fetch(config.apiUrl, {method: 'post', body: JSON.stringify(body)}).catch((error) => error);
		if(response instanceof Error) return console.log('ERROR FETCHING DATA: ', response.message);
		const result: any | Error = await response.json().catch((error: any) => error);
		if(result instanceof Error) return console.log(result.message);

		setMatches(formatMatches(result))
	}

	console.log(matches)
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
}