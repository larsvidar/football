export const queries = {
	graphQL: {
		eliteSerien2022: (tournamentId = '') => ({
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

		teamMatches: (teamId = '', from = '2022-01-01', to = '2024-01-01') => ({
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
