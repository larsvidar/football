/***** IMPORTS *****/
import {TeamMatches} from 'components/TeamMatches/TeamMatches';
import {FC, useEffect, useState} from 'react';
import {Fetcher} from 'utils/Fetcher';
import {ITournament, ITeam} from '../../types/tournament';
import styles from './Tournament.module.scss';


/***** COMPONENT *****/
export const Tournament: FC = (): JSX.Element => {

	/*** Variables ***/
	const fetcher = new Fetcher();

	/*** State ***/
	const [tournament, setTournament] = useState<ITournament | null>(null);
	const [team, setTeam] = useState<ITeam | null>(null);


	/*** Effects ***/

	//Runs once
	//	- Fetches tournament-data
	useEffect(() => {
		fetchTournament();
		//setSeries(testSeries);
	}, []);


	/*** Functions ***/

	/**
	 * Fetching tournament-data and setting it to tournament-state.
	 * @returns {void}
	 */
	const fetchTournament = async (): Promise<void> => {
		const tournament = await fetcher.getTournament();
		if(tournament instanceof Error) return console.log(tournament.message);

		setTournament(tournament);
	};


	/*** Return-JSX ***/
	if (!tournament?.title) return <p style={{color: 'white'}}>Ingen data funnet ...</p>;
	return (
		<div className={styles.Tournament}>
			<h2>{tournament.title}</h2>

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
						{tournament.teams?.map((team) => {
							const {data} = team;
							return (
								<tr key={team.id}>
									<td>{team.rank}. </td>
									<td><img src={team.logo || ''} alt={team.title} height={32} /></td>
									<td onClick={(): void => setTeam(team)}>
										{team.title}
									</td>
									<td>{data?.played}</td>
									<td>{data?.wins}</td>
									<td>{data?.draws}</td>
									<td>{data?.defeits}</td>
									<td>{data?.goalsfor} - {data?.goalsagainst}</td>
									<td>{data?.points}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			}
		</div>
	);
};
