package com.example.tactalk.network

import com.example.tactalk.login.LoginResponse
import com.example.tactalk.team.CreateTeamResponse
import com.example.tactalk.match.SetUpMatchResponse
import com.example.tactalk.statistics.StatsProperty
import com.example.tactalk.player.AllPlayersResponse
import com.example.tactalk.player.PlayerResponse
import com.example.tactalk.register.RegisterResponse
import com.example.tactalk.user.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.http.*

interface TacTalkAPI {
    // user register
    @POST("/user/register")
    @FormUrlEncoded
    fun registerUser(
        @Field("firstName") firstName: String,
        @Field("lastName") lastName: String,
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<RegisterResponse>

    // user login
    @POST("/user/login/")
    @FormUrlEncoded
    fun loginUser(
        @Field("email") email: String,
        @Field("password") password: String,
    ): Call<LoginResponse>

    // set up a match
    @POST("/user/games/create")
    @FormUrlEncoded
    fun setUpMatch(
        @Field("gameType") gameType: String,
        @Field("teamName") teamName: String,
        @Field("teamColor") teamColor: String,
        @Field("opposition") opposition: String,
        @Field("oppColor") oppColor: String,
        @Field("location") location: String,
        @Field("startDate") startDate: String,
        @Field("startTime") startTime: String,
        @Header("Authentication") token: String
    ): Call<SetUpMatchResponse>

    // user details
    @GET("user/games/updateGame/")
    fun getMatchStatistics(
        @Query("game_id") game_id: String,
        @Header("Authentication") token: String
    ): Call<StatsProperty>

    // user details
    @GET("/user/users/get/user_details")
    fun getUserDetails(@Header("Authentication") token: String): Call<User>

    // user details
    @GET("/user/players/all_players")
    fun getAllPlayers(
        @Query("team_id") team_id: String,
        @Header("Authentication") token: String
    ): Call<AllPlayersResponse>

    // add a player
    @POST("/user/players/create_player/")
    @FormUrlEncoded
    fun addPlayer(
        @Field("team_id") team_id: String,
        @Field("playerName") playerName: String,
        @Field("playerNumber") playerNumber: String,
        @Header("Authentication") token: String
    ): Call<PlayerResponse>

    // create a team
    @POST("/user/create_team/")
    @FormUrlEncoded
    fun createTeam(
        @Field("teamName") teamName: String,
        @Field("teamColor") teamColor: String,
        @Field("teamLevel") teamLevel: String,
        @Header("Authentication") token: String
    ): Call<CreateTeamResponse>

    // check if user has a team
    @GET("/user/check_team_exists")
    fun checkTeamExists(
        @Header("Authentication") token: String
    ): Call<CreateTeamResponse>

}