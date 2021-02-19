package com.example.tactalk.network

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.converter.scalars.ScalarsConverterFactory

object RetrofitClient {

    private var instance: Retrofit? = null



        fun getInstance():Retrofit {
            if (instance == null) instance = Retrofit.Builder()
                    .baseUrl("https://tactalk-rojak.herokuapp.com")
                    .addConverterFactory(ScalarsConverterFactory.create())
                    .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                    .build()
            return instance!!
        }



}
/*
object ResApi {
    val retrofitService: TacTalkAPI by lazy {
        instance.create(TacTalkAPI::class.java)
    }
}*/