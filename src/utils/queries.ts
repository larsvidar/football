/***** IMPORTS *****/
import {IGraphQlQuery} from 'types/general';


/***** QUERIES-OBJECT *****/
export const queries = {
	graphQL: {
		//Queries for fetching tournaments
		tournament: (tournamentId = ''): IGraphQlQuery => ({
			query: `query table($tournamentStageId: ID!) {
				tournamentStage(id: $tournamentStageId) {
					name
					standings(type: LEAGUE_TABLE) {
						participants {
							participant {
								id
								name
								images {url}
							}
							rank
							data {
								code
								value
							}
						}
					}
				}
			}`,
			variables: {
				tournamentStageId: tournamentId,
			}, 
		}),

		//Query for fetching matches for a team for a given time-period.
		teamMatches: (teamId = '', from = '2022-01-01', to = '2024-01-01'): IGraphQlQuery => ({
			query: `query teamMatches(
				$participantId: ID!, 
				$fromDate: LocalDate!, 
				$toDate: LocalDate!
			) {
				eventsByParticipantAndDateRange(
					participantId: $participantId, 
					fromDate: $fromDate, 
					toDate: $toDate
				) {
					id
					startDate
					name
					tournamentStage {
						name
					}
					participants {
						participant {
							id
							name
							images {url}
						}
					}
				}
			}`,
			variables: {
				participantId: teamId, 
				fromDate: from, 
				toDate: to,
			}
		}),
	},
};
