
interface ITeamDataFull {
	points: number,
	goalsfor: number,
	winshome: number,
	played: number,
	wins: number,
	rank: number,
	defeits: number,
	defeitshome: number,
	goalsforhome: number,
	goalsagainsthome: number,
	goalsagainst: number,
	playedhome: number,
	winsaway: number,
	draws: number,
	playedaway: number,
	drawshome: number,
	drawsaway: number,
	defeitsaway: number,
	goalsforaway: number,
	goalsagainstaway: number,
	pointshome: number,
	pointsaway: number,
	trend: number,
}
export type ITeamData = Partial<ITeamDataFull>


export interface ITeam {
	id: string,
	title: string,
	slug: string,
	rank?: number,
	data?: ITeamData,
	logo?: string
}


export interface ITournament {
	title: string,
	teams?: ITeam[],
}