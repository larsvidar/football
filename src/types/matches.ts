import {ITeam} from "./series";


export interface IMatch {
	id: string,
    tournament: string,
    startDate: string,
	startTime: string,
    title: string,
    teams: ITeam[],
}