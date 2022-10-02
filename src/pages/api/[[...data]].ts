//Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {genObject} from 'types/general';
import {IMatch} from 'types/matches';
import {ITournament} from 'types/tournament';
import {ServerFetcher} from 'utils/server/ServerFetcher';
import {handleRequest} from 'utils/server/serverUtils';

/***** TYPES *****/
type Data = genObject


/***** API-HANDLER *****/
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>): Promise<void> {
	
	/*** Variables ***/
	//Process request-object
	const request = handleRequest(req);
	const {method, query, data} = request || {};
	const {teamId, fromDate, toDate} = query || {};
	const fetcher = new ServerFetcher();

	//Check if request is approved
	if(method !== 'GET') return res.status(405).json({error: 'Method not allowed'});
	if(!data?.includes('tournament') && !data?.includes('matches')) return res.status(400).json({error: 'Not found'});
	
	/*** Handle request ***/
	let result: ITournament | IMatch[] | Error | null= null;
	if(data?.includes('tournament')) {
		result = await fetcher.getTournament();
	}

	if(data?.includes('matches')) {
		result = await fetcher.getTeamMatches(teamId, fromDate, toDate);
	}

	//Check and return result
	if(result instanceof Error) return res.status(400).json({error: result.message});
	if(!result) return res.status(400).json({error: 'Unknown error'});
	res.status(200).json(result);
}
