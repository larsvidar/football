import {ITournament} from 'types/tournament';
import {formatTournament} from './formatters';
import {queries} from './queries';

export class Fetcher {
	apiUrl = process.env.NEXT_PUBLIC_APIURL || '';
	defaultTournamentId = process.env.NEXT_PUBLIC_ELITESERIEN_ID || '';


	async getTournament(tournamentId = this.defaultTournamentId): Promise<ITournament | null | Error> {
		const query = queries.graphQL.eliteSerien2022(tournamentId);

		const tournament = this.#fetchData<ITournament | Error>({method: 'POST'}, query);
		if(tournament instanceof Error) return tournament;
		return formatTournament(tournament);
	}

	async getTeamMatches(teamId = '', fromDate: string, toDate: string) {
		const query = queries.graphQL.teamMatches(teamId, fromDate, toDate);

		const matches = this.#fetchData({method: 'POST'}, query);
		return matches;
	}

	async #fetchData<T>(options: any, data?: any): Promise<T | Error> {
		if(!options.method) options.method = 'GET';
		if(data) options.body = JSON.stringify(data);

		const response: Response | Error = await fetch(this.apiUrl, options).catch((error) => error);
		if(response instanceof Error) return response;
		const result: T | Error = await response.json().catch((error: any) => error);
		return result;
	}
}
