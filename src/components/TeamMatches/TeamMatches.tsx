import {matchesMiddleware} from "next/dist/shared/lib/router/router";
import {useEffect, useState} from "react";
import {config} from "utils/config";
import styles from './TeamMatches.module.scss';

export const TeamMatches = ({teamState}: any) => {

	const [team, setTeam] = teamState;
	const [matches, setMatches] = useState([] as any);


	useEffect(() => {
		fetchTeam(team.id);
	}, [team])


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

		if(matches.data) return;
		const response: Response | Error = await fetch(config.apiUrl, {method: 'post', body: JSON.stringify(body)}).catch((error) => error);
		if(response instanceof Error) return console.log('ERROR FETCHING DATA: ', response.message);
		const result: any | Error = await response.json().catch((error: any) => error);
		if(result instanceof Error) return console.log(result.message);

		setMatches(formatMatches(result))
	}

	const formatMatches = (rawData: any) => {
		const data = rawData.data.eventsByParticipantAndDateRange;
		const matches = data.map((match: any) => {
			return {
				tournament: match.tournamentStage.name,
				starts: match.startDate,
				teams: match.participants.map((participant: any) => ({title: participant.participant.name, logo: participant.participant.images[0]?.url}))
			};
		}) 


		return matches;
	}

	console.log(matches)

	return (
		<div className={styles.TeamMatches}>
			<p onClick={() => setTeam(null)}>Gå tilbake</p>
			<h2>Kamper for {team.title}</h2>
			<table>
				<thead>
					<tr>
						<th>Hjemmelag</th>
						<th>Bortelag</th>
						<th>Kampdato</th>
						<th>Kamptid</th>
					</tr>
				</thead>
				<tbody>
					{matches.map((match: any) => {
						return (
							<tr key={match.starts}>
								<td>{match.teams[0].title}</td>
								<td>{match.teams[1].title}</td>
								<td>{new Date(match.starts).toLocaleDateString()}</td>
								<td>{new Date(match.starts).toLocaleTimeString().replace(':00', '')}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			
		</div>
	);
}