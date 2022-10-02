/***** IMPORTS *****/
import {TeamMatches} from "components/TeamMatches/TeamMatches";
import {useEffect, useState} from "react";
import {config} from "utils/queries";
import {formatSeries} from "utils/formatters";
import {ISeries, ITeam} from "../../types/series";
import styles from './Results.module.scss';
import Image from "next/image";


/***** COMPONENT *****/
export const Results = () => {

	/*** State ***/
	const [series, setSeries] = useState<ISeries | null>(null);
	const [team, setTeam] = useState<ITeam | null>(null);


	/*** Effects ***/
	useEffect(() => {
		fetchSeries();
		//setSeries(testSeries);
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

		setSeries(formatSeries(result))
	};

	console.log(series)

	/*** Return-JSX ***/
	if(!series?.title) return <p>Ingen data funnet</p>
	return (
		<div className={styles.Results}>
			<h2>{series.title}</h2>

			{team && 
				<TeamMatches teamState={[team, setTeam]} />
			}
			{!team && 
				<table className={styles.table}>
					<thead>
						<tr>
							<th>#</th>
							<th>Lag</th>
							<th></th>
							<th>Kamper</th>
							<th>Vunnet</th>
							<th>Uavgjort</th>
							<th>Tap</th>
							<th>Mål</th>
							<th>Poeng</th>
						</tr>
					</thead>

					<tbody>
						{series.teams?.map((team) => {
							const {data} = team;
							return (
								<tr key={team.id}>
									<td>{team.rank}. </td>
									<td><img src={team.logo || ''} alt={team.title} height={'32px'} /></td>
									<td onClick={() => setTeam(team)}>
										{team.title}
									</td>
									<td>{data?.played}</td>
									<td>{data?.wins}</td>
									<td>{data?.draws}</td>
									<td>{data?.defeits}</td>
									<td>{data?.goalsfor} - {data?.goalsagainst}</td>
									<td>{data?.points}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			}
		</div>
	);
};
