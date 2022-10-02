export interface genObject {
	[x: string]: any
}

export interface IGraphQlQuery {
	query: string,
	variables: genObject,
}