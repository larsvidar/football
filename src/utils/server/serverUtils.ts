/***** IMPORTS *****/
import {NextApiRequest} from 'next';
import {genObject, IRequest} from 'types/general';


/***** IMPORTS *****/
export const handleRequest = (req: NextApiRequest): IRequest => {
	const request: genObject = {
		method: req.method,
		body: req.body,
		headers: req.headers,
	};
	const {query} = req || {};
	if(query?.data) request.data = query.data;
	delete query.data;
	request.query = query;

	return request as IRequest;
};
