/***** IMPORTS *****/
import {TeamMatches} from 'components/TeamMatches/TeamMatches';
import {useRouter} from 'next/router';
import {FC, MouseEvent, MouseEventHandler, SyntheticEvent, useEffect, useState} from 'react';
import {Fetcher} from 'utils/Fetcher';
import {ITournament, ITeam} from '../../types/tournament';
import styles from './Tournament.module.scss';


/***** TYPES *****/
interface ITournamentProps {
	data: ITournament,
}


/***** COMPONENT *****/
export const Tournament: FC<ITournamentProps> = ({data}): JSX.Element => {

	/*** Variables ***/
	const fetcher = new Fetcher();
	const router = useRouter();
	const UPDATE_INTERVAL = 60 * 1000; //60 seconds

	/*** State ***/
	const [tournament, setTournament] = useState<ITournament | null | undefined>(data);
	const [team, setTeam] = useState<ITeam | null>(null);


	/*** Effects ***/

	//Runs once
	// - Fetches tournament-data
	useEffect(() => {
		const interval = setInterval(fetchTournament, UPDATE_INTERVAL);
		
		return () => {
			clearInterval(interval);
		};
	}, []);


	useEffect(() => {
		const teamId = router.query.team;
		const foundTeam = tournament?.teams?.find?.((thisTeam) => thisTeam.id === teamId);
		if(foundTeam) setTeam(foundTeam);
		else(setTeam(null));
	}, [router]);


	/*** Functions ***/

	/**
	 * Fetching tournament-data and setting it to tournament-state.
	 * @returns {void}
	 */
	const fetchTournament = async (): Promise<void> => {
		const tournament = await fetcher.getTournament();
		if(tournament instanceof Error) {
			setTournament(null);
			return console.log(tournament.message);
		}

		setTournament(tournament);
	};


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
			<h2>{tournament.title}</h2>
			<p>(Tabellen oppdateres hvert minutt)</p>

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
