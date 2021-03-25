package com.example.tactalk.network.statistics

data class StatsProperty (
        val result: Response
)

data class Response (
        val teamGoal: String,
        val teamPoints: String,
        val teamShots: String,
        val teamKickouts:String,
        val teamTurnover:String,
        val teamWides: String,
        val oppTeamGoal: String,
        val oppTeamPoints:String,
        val oppTeamShots: String,
        val oppTeamTurnover: String
)