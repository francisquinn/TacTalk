package com.example.tactalk.team

data class CreateTeamResponse(
    val message: String,
    val team_id: String,
    val team_name: String,
    val team_color: String,
    val team_level: String
)