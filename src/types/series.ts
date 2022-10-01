
export interface ITeamData {
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


export interface ITeam {
	id: string,
	title: string,
	rank?: number,
	data?: ITeamData,
	logo?: string
}


export interface ISeries {
	title: string,
	teams?: ITeam[],
}