import {IMatch} from 'types/matches';
import {ISeries, ITeam, ITeamData} from 'types/series';

export const formatSeries = (rawData: any): ISeries | null => {
	const data = rawData?.data?.tournamentStage;
	if(!data) return null;
	
	const teams: ITeam[] = data.standings?.[0].participants.map((team: any) => formatTeam(team));

	const newData: ISeries = {
		title: data.name,
		teams,
	}

	return newData;
}


export const formatTeam = (team: any): ITeam | null => {
	if(!team) return null;

	const data = formatTeamData(team.data);

	const newTeam: ITeam = {
		id: team.participant?.id,
		title: team.participant?.name,
		slug: getTeamSlug(team.participant?.name) || team.participant?.name,
		rank: team.rank,
		logo: team.participant?.images?.[0]?.url,
	}
	if(data) newTeam.data = data;

	return newTeam;
}


export const formatTeamData = (data: any): ITeamData | null => {
	if(!data) return null;
	const newData: any = data.reduce((newData: any, dataPoint: any) => {
		if(dataPoint?.code && +dataPoint.value) newData[dataPoint.code] = +dataPoint.value;
		return newData;
	}, {});

	return newData;
}

export const formatMatches = (rawData: any): IMatch[] | null => {
	const data = rawData?.data?.eventsByParticipantAndDateRange;
	if(!data) return null;
	const matches = data.map((match: any) => {
		return {
			id: match.id,
			tournament: match.tournamentStage.name,
			startDate: new Date(match.startDate).toLocaleDateString(),
			startTime: new Date(match.startDate).toLocaleTimeString().replace(':00', ''),
			title: match.name,
			teams: match.participants.map((team: any) => formatTeam(team)),
		};
	}) 

	return matches;
}


export const getTeamSlug = (title: string, slug?: string) => {

	const slugs: any = {
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
		const item = Object.keys(slugs).find((key) => slugs[key] === slug) || {};
		return Object.values(item)[0];
	}

	return slugs[title];
}
