/***** IMPORTS *****/
import {genObject} from 'types/general';
import {IMatch} from 'types/matches';
import {ITournament, ITeam, ITeamData} from 'types/tournament';


/***** FUNCTIONS *****/

/**
 * Function for formatting tournament-data
 * @param {genObject} rawData Data to be formatted
 * @returns {ITournament | null}
 */
export const formatTournament = (rawData: genObject): ITournament | null => {
	const data = rawData?.data?.tournamentStage;
	if(!data) return null;
	
	const teams: ITeam[] = data.standings?.[0].participants.map((team: genObject) => formatTeam(team));

	const newData: ITournament = {
		id: data.id,
		title: data.name,
		teams,
	};

	return newData;
};


/**
 * Function for formatting a team
 * @param {genObject} rawData Data to be formatted
 * @returns {ITeam | null}
 */
export const formatTeam = (rawData: genObject): ITeam | null => {
	if(!rawData) return null;

	const data = formatTeamData(rawData.data);

	const newTeam: ITeam = {
		id: rawData.participant?.id,
		title: rawData.participant?.name,
		slug: getTeamSlug(rawData.participant?.name) || rawData.participant?.name,
		rank: rawData.rank || null,
		logo: rawData.participant?.images?.[0]?.url || null,
	};
	if(data) newTeam.data = data;

	return newTeam;
};


/**
 * Function for formatting team-data
 * @param {genObject} rawData Data to be formatted
 * @returns {ITeamData | null}
 */
export const formatTeamData = (rawData: genObject): ITeamData | null => {
	if(!rawData) return null;
	const newData: ITeamData = rawData?.reduce((newData: genObject, dataPoint: {code: string, value: string}) => {
		if(dataPoint?.code && +dataPoint.value) newData[dataPoint.code] = +dataPoint.value;
		return newData;
	}, {});

	return newData;
};


/**
 * Function for formatting match-data
 * @param {genObject} rawData 
 * @returns {IMatch[] | null}
 */
export const formatMatches = (rawData: genObject): IMatch[] | null => {
	const data = rawData?.data?.eventsByParticipantAndDateRange;
	if(!data) return null;
	const matches = data.map((match: genObject) => {
		return {
			id: match.id,
			tournament: match.tournamentStage.name,
			startDate: new Date(match.startDate).toLocaleDateString(),
			startTime: new Date(match.startDate).toLocaleTimeString().replace(':00', ''),
			title: match.name,
			teams: match.participants.map((team: genObject) => formatTeam(team)),
		};
	}); 

	return matches;
};


/**
 * Function for returning slug from team-title, or vica versa.
 * @param {string} title Title to get slug for.
 * @param {string} slug Slug to get title for. Always returns title if slug is defined
 * @returns {string}
 */
export const getTeamSlug = (title?: string, slug?: string): string => {

	const slugs: {[x: string]: string} = {
		'Molde': 'Molde',
		'Lillestrøm': 'Lillestroem',
		'Rosenborg': 'Rosenborg',
		'FK Bodø/Glimt': 'Bodoe/Glimt',
		'Vålerenga': 'Vaalerenga',
		'Viking': 'Viking',
		'Odd': 'Odds Ballklubb',
		'Strømsgodset': 'Stroemsgodset',
		'Tromsø': 'Tromsoe',
		'Haugesund': 'FK Haugesund',
		'Sarpsborg 08': 'Sarpsborg',
		'Aalesund': 'Aalesund',
		'HamKam': 'Hamarkameratene',
		'Sandefjord': 'Sandefjord',
		'Kristiansund': 'Kristiansund BK',
		'Jerv': 'Jerv',
	};

	if(slug) {
		const item = Object.keys(slugs).find((key) => slugs[key] === slug) || slug;
		return item;
	}

	return slugs[title || 'none'];
};
