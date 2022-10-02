export const queries = {
	graphQL: {
		eliteSerien2022(tournamentId = '') {
			return {
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
			}
		},

		teamMatches: {
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
				participantId: '', 
				fromDate: new Date().toLocaleDateString(), 
				toDate: new Date().toLocaleDateString(),
			}
		},
	},
}
