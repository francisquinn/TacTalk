package com.example.tactalk.network

import io.reactivex.Observable
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface TacTalkAPI {
    @POST("/user/register")
    @FormUrlEncoded
    fun registerUser(@Field("username") name: String,
                     @Field("email") email: String,
                     @Field("password") password: String) : Observable<String>
    

    @POST("/user/login/")
    @FormUrlEncoded
    fun loginUser(@Field("email") email: String,
                  @Field("password") password: String): Observable<String>

    //user id if finish login, team id = -1, start time = -1,  public =1 , team color(blue green), oppColor()
    @POST("/user/setUpMatch")
    @FormUrlEncoded
    fun setUpMatch(@Field("gameType") gameName: String,
                   @Field("gameType") gameType: String,
                   @Field("teamName") teamName: String,
                   @Field("teamColor") teamColor: String,
                   @Field("opposition") opposition: String,
                   @Field("oppColor") oppColor: String,
                   @Field("location") location: String,
                   @Field("public") public: String,
                   @Field("startDate") startDate: String,
                   @Field("startTime") startTime: String): Observable<String>
}