import {ITournament} from "types/tournament";
import {queries} from "./queries";

export class Fetcher {
	apiUrl = process.env.NEXT_PUBLIC_APIURL || '';;
	defaultTournamentId = process.env.NEXT_PUBLIC_ELITESERIEN_ID || ''


	async getTournament(tournamentId = this.defaultTournamentId) {
		const query = queries.graphQL.eliteSerien2022(tournamentId);

		const tournament = this.#fetchData<ITournament>({method: 'POST'}, query);
		return tournament;
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