/***** IMPORTS *****/
import {TeamMatches} from 'components/TeamMatches/TeamMatches';
import {useRouter} from 'next/router';
import {IPropType} from 'pages';
import {FC, MouseEvent, useEffect, useState} from 'react';
import {Fetcher} from 'utils/Fetcher';
import {ITournament} from '../../types/tournament';
import styles from './Tournament.module.scss';


/***** TYPES *****/
interface ITournamentProps {
	data: IPropType,
}


/***** COMPONENT *****/
export const Tournament: FC<ITournamentProps> = ({data}): JSX.Element => {

	/*** Variables ***/
	const fetcher = new Fetcher();
	const router = useRouter();
	const teamId = router.query.team;
	const UPDATE_INTERVAL = 10 * 1000; //60 seconds


	/*** State ***/
	const [tournament, setTournament] = useState<ITournament | null | undefined>(data.tournament);
	const [isUpdating, setIsUpDating] = useState(false);

	
	/*** Effects ***/

	//Runs once
	// - Fetches tournament-data
	useEffect(() => {
		const interval = setInterval(fetchTournament, UPDATE_INTERVAL);
		
		return () => {
			clearInterval(interval);
		};
	}, []);


	/*** Functions ***/

	/**
	 * Fetching tournament-data and setting it to tournament-state.
	 * @returns {void}
	 */
	const fetchTournament = async (): Promise<void> => {
		setIsUpDating(true);
		const tournament = await fetcher.getTournament();
		setIsUpDating(false);
		if(tournament instanceof Error) {
			setTournament(null);
			return console.log(tournament.message);
		}

		setTournament(tournament);
	};


	/**
	 * Handles clicking a teams name.
	 * @param {MouseEvent<HTMLDivElement>} event Click-event-object
	 * @return {void} Pushes team-id to url-params.
	 */
	const handleTeamClick = (event: MouseEvent<HTMLDivElement>): void => {
		const target = event.target as HTMLDivElement;
		const teamId = target.dataset.id;

		if(teamId) {
			const params = '?' + new URLSearchParams({team: teamId}).toString();
			router.push(params);
		}
	};


	/*** Return-JSX ***/
	if(tournament === null) return <p style={{color: 'white'}}>Ingen data funnet ...</p>;
	if (!tournament) return <p style={{color: 'white'}}>Vent litt ...</p>;
	return (
		<div className={styles.Tournament}>
			<header>
				<h1>{tournament.title}</h1>
				<p>(Tabellen oppdateres hvert minutt)</p>
				{isUpdating && <p>Oppdaterer ...</p>}
			</header>

			{teamId && <TeamMatches data={data.matches} />}
			{!teamId &&
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
									<td 
										onClick={handleTeamClick}
										data-id={team.id}
									>
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
