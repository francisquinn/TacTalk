package com.example.tactalk.network

import io.reactivex.Observable
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface TacTalkAPI {
    @POST("/user/register/")
    @FormUrlEncoded
    fun registerUser(@Field("username") name: String,
                     @Field("email") email: String,
                     @Field("password") password: String) : Observable<String>

    @POST("/user/login/")
    @FormUrlEncoded
    fun loginUser(@Field("name") name: String,
                  @Field("password") password: String): Observable<String>
}