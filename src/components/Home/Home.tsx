/***** IMPORTS *****/
import {TeamMatches} from "components/TeamMatches/TeamMatches";
import {useEffect, useState} from "react";
import {testSeries} from "tests/data/series";
import {config} from "utils/config";
import {ISeries, ITeam} from "../types/general";
import styles from './Home.module.scss';


/***** COMPONENT *****/
export const Home = () => {

	/*** State ***/
	const [series, setSeries] = useState({} as ISeries);
	const [team, setTeam] = useState<any | null>(null);


	/*** Effects ***/
	useEffect(() => {
		//fetchSeries();
		setSeries(testSeries);
	}, []);


	/*** Functions ***/
	const fetchSeries = async (): Promise<void> => {
		const query = config.graphQL.queries.eliteSerien2022.query;
		const variables = config.graphQL.queries.eliteSerien2022.variables;
		const body = {query, variables}

		const response: Response | Error = await fetch(config.apiUrl, {method: 'post', body: JSON.stringify(body)}).catch((error) => error);
		if(response instanceof Error) return console.log('ERROR FETCHING DATA: ', response.message);
		const result: any | Error = await response.json().catch((error: any) => error);
		if(result instanceof Error) return console.log(result.message);

		setSeries(formatTable(result))
	};




	const formatTable = (rawData: any): ISeries => {
		const data = rawData.data.tournamentStage;
		const teams: ITeam[] = data.standings?.[0].participants.map((team: any) => {
			console.log(team);
			const data: any = team.data.reduce((newData: any, dataPoint: any) => {
				newData[dataPoint.code] = +dataPoint.value;
				return newData;
			}, {});
			return {
				id: team.participant.id,
				title: team.participant.name,
				rank: team.rank,
				data,
			}
		});

		const newData: ISeries = {
			title: data.name,
			teams,
		}

		return newData;
	}


	/*** Return-JSX ***/
	if(!series.title) return <p>Ingen data funnet</p>
	return (
		<div className={styles.Home}>
			<h2>{series.title}</h2>

			{team && 
				<TeamMatches teamState={[team, setTeam]} />
			}
			{!team && 
				<table>
					<thead>
						<tr>
							<th>Lag</th>
							<th>Plassering</th>
							<th>Kamper spilt</th>
							<th>Seiere</th>
							<th>Uavgjort</th>
							<th>Tap</th>
							<th>Mål</th>
							<th>Sluppet inn</th>
							<th>Poeng</th>
						</tr>
					</thead>

					<tbody>
						{series.teams?.map((team) => {
							const {data} = team;
							return (
								<tr key={team.id}>
									<td onClick={() => setTeam(team)}>{team.title}</td>
									<td>{team.rank}</td>
									<td>{data.played}</td>
									<td>{data.wins}</td>
									<td>{data.draws}</td>
									<td>{data.defeits}</td>
									<td>{data.goalsfor}</td>
									<td>{data.goalsagainst}</td>
									<td>{data.points}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			}
		</div>
	);
};
