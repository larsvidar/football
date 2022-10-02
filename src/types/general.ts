export interface genObject {
	[x: string]: any
}

export interface IGraphQlQuery {
	query: string,
	variables: genObject,
}

export interface IHeaders {
	host: string,
    connection: string,
    'sec-ch-ua': string,
    'sec-ch-ua-mobile': '?0' | '?1',
    'user-agent': string,
    'sec-ch-ua-platform': string,
    accept: string,
    'sec-fetch-site': 'same-origin' | 'cross-site' | 'same-origin' | 'same-site' | 'none',
    'sec-fetch-mode': 'cors' | 'navigate' | 'no-cors' | 'same-origin' | 'websocket',
    'sec-fetch-dest': string,
    referer: string,
    'accept-encoding': string,
    'accept-language': string,
    cookie: string,
    'if-none-match': string
}

export interface IRequest {
	method: 'GET' | 'POST' | 'CREATE' | 'UPDATE' | 'DELETE',
	headers: IHeaders,
	data?: string[],
	query?: genObject,
	body?: genObject,
}