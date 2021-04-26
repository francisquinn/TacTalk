package com.example.tactalk.statistics

data class StatsProperty(
    val result: Response
)

data class Response(

    val teamGoal: Int,
    val teamPoints: Int,
    val teamShots: Int,
    val teamKickouts: Int,
    val teamTurnover: Int,
    val teamWides: Int,
    val teamPass: Int,
    val oppTeamGoal: Int,
    val oppTeamPoints: Int,
    val oppTeamShots: Int,
    val oppTeamKickouts: Int,
    val oppTeamTurnover: Int,
    val oppTeamPass: Int,
    val oppTeamWides: Int,
    val teamZoneWithMostShots: Int,
    val teamZoneWithMostKickouts: Int,
    val oppTeamZoneWithMostShots: Int,
    val oppTeamZoneWithMostKickouts: Int,
    val teamPossession: Int,
    val oppTeamPossession: Int,
    val teamPassCompletion: Int,
    val oppTeamPassCompletion: Int,
    val teamShotConversion: Int,
    val oppTeamShotConversion: Int,
    val teamKickoutsWon: Int,
    val oppTeamKickoutsWon: Int

)