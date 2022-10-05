/***** IMPORTS *****/
import {genObject} from 'types/general';
import {IMatch} from 'types/matches';
import {ITournament} from 'types/tournament';


/***** CLASS FOR FETCHING DATA *****/
export class Fetcher {

	/*** Variables ***/
	#tournamentUrl = '/api/tournament';
	#tournamentsUrl = '/api/tournaments';
	#matchesUrl = '/api/matches';


	/*** Methods ***/

	/**
	 * Method for fetching tournament-data.
	 * @param {string} tournamentId Id of tournament to fetch.
	 * @returns {Promise<ITournament | null | Error>}
	 */
	async getTournament(tournamentId = ''): Promise<ITournament | null | Error> {
		const params = '?' + new URLSearchParams({tournamentId}).toString();

		const tournament = await this.#fetchData<ITournament | Error>(this.#tournamentUrl + params);
		if(tournament instanceof Error) return tournament;
		return tournament;
	}

	/**
	 * Method for fetching tournaments.
	 * @returns {Promise<ITournament | null | Error>}
	 */
	async getTournaments(): Promise<ITournament | null | Error> {
		const tournaments = await this.#fetchData<ITournament | Error>(this.#tournamentsUrl);
		if(tournaments instanceof Error) return tournaments;
		return tournaments;
	}


	/**
	 * Fetches an array of a teams matches
	 * @param {string} teamId Id of team to fetch matches for.
	 * @param {string} fromDate Date to fetch matches from (format YYYY-MM-DD)
	 * @param {string} toDate Date to fetch matches to (format YYYY-MM-DD)
	 * @returns {Promise<IMatch[] | null | Error>}
	 */
	async getTeamMatches(teamId = '', fromDate: string, toDate: string): Promise<IMatch[] | null | Error> {
		const params = '?' + new URLSearchParams({teamId, fromDate, toDate}).toString();
		const matches = await this.#fetchData<IMatch[]>(this.#matchesUrl + params);
		if(matches instanceof Error) return matches;
		return matches;
	}


	/**
	 * Private method for sending general requests.
	 * @param {any} options Options for fetch-operation
	 * @param {any} data Data to be attached to the request-body 
	 * @returns {Promise<T | Error>} Returns passed data-type, or error
	 */
	async #fetchData<T>(url: string): Promise<T | Error> {
		const options = {method: 'GET'};

		const response: Response | Error = await fetch(url, options).catch((error) => error);
		if(response instanceof Error) return response;
		const result: genObject = await response.json().catch((error) => error);
		if(result.error) return Error(result.error);
		return result as T;
	}
}
