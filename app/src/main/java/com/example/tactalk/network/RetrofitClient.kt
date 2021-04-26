package com.example.tactalk.network


import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {

    private var instance: Retrofit? = null
    private val interceptor = HttpLoggingInterceptor()

    // Http client
    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .addInterceptor(interceptor)
        .build()

    // moshi parsing
    private val moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    // retrofit builder
    fun getInstance(): Retrofit {
        interceptor.setLevel(HttpLoggingInterceptor.Level.BODY)
        if (instance == null) instance = Retrofit.Builder()
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .baseUrl("https://tactalk-rojak.herokuapp.com")
            .client(okHttpClient)
            .build()
        return instance!!
    }

}