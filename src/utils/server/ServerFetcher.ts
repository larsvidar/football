/***** IMPORTS *****/
import {genObject} from 'types/general';
import {IMatch} from 'types/matches';
import {ITournament} from 'types/tournament';
import {formatMatches, formatTournament} from 'utils/formatters';
import {queries} from 'utils/server/queries';


/***** CLASS FOR FETCHING DATA *****/
export class ServerFetcher {

	/*** Variables ***/
	#apiUrl = process.env.APIURL || '';
	#defaultTournamentId = process.env.DEFAULT_TOURNAMENT_ID || '';


	/*** Methods ***/

	/**
	 * Method for fetching tournament-data.
	 * @param {string} tournamentId Id of tournament to fetch.
	 * @returns {Promise<ITournament | null | Error>}
	 */
	async getTournament(tournamentId = this.#defaultTournamentId): Promise<ITournament | null | Error> {
		const query = queries.graphQL.tournament(tournamentId);
	
		const tournament = await this.#fetchData<genObject | Error>({method: 'POST'}, query);
		if(tournament instanceof Error) return tournament;
		return formatTournament(tournament);
	}


	/**
	 * Fetches an array of a teams matches
	 * @param {string} teamId Id of team to fetch matches for.
	 * @param {string} fromDate Date to fetch matches from (format YYYY-MM-DD)
	 * @param {string} toDate Date to fetch matches to (format YYYY-MM-DD)
	 * @returns {Promise<IMatch[] | null | Error>}
	 */
	async getTeamMatches(teamId = '', fromDate: string, toDate: string): Promise<IMatch[] | null | Error> {
		const query = queries.graphQL.teamMatches(teamId, fromDate, toDate);

		const matches = await this.#fetchData<genObject>({method: 'POST'}, query);
		if(matches instanceof Error) return matches;
		return formatMatches(matches);
	}


	/**
	 * Private method for sending general requests.
	 * @param {any} options Options for fetch-operation
	 * @param {any} data Data to be attached to the request-body 
	 * @returns {Promise<T | Error>} Returns passed data-type, or error
	 */
	async #fetchData<T>(options: genObject, data?: unknown): Promise<T | Error> {
		if(!options.method) options.method = 'GET';
		if(data) options.body = JSON.stringify(data);

		const response: Response | Error = await fetch(this.#apiUrl, options).catch((error) => error);
		if(response instanceof Error) return response;
		const result: T | Error = await response.json().catch((error) => error);
		return result;
	}
}
