package com.example.tactalk.player

data class AllPlayersResponse(
    val message: String,
    val result: List<PlayerResponseAll>
)

data class PlayerResponseAll (
    val _id: String,
    val player_name: String,
    val player_number: String
)