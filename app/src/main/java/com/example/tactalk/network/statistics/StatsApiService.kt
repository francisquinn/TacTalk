package com.example.tactalk.network.statistics

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.GET

private const val BASE_URL = "https://tactalk-rojak.herokuapp.com/"
private val moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

private val retrofit = Retrofit.Builder()
        .addConverterFactory(MoshiConverterFactory.create(moshi))
        .baseUrl(BASE_URL)
        .build()

interface StatsApiService {
    //@GET("user/games/updateGame/?game_id=60084b37e8c56c0978f5b004&user_id=602ce3432185a70004bb8d17")
    @GET("user/games/updateGame/?dummyData=0&game_id=1&user_id=1")
    suspend fun getStatProperties(): StatsProperty
}

object StatsApi {
    val retrofitService: StatsApiService by lazy {
        retrofit.create(StatsApiService::class.java)
    }
}