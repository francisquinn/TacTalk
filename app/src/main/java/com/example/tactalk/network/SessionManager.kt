package com.example.tactalk.network

import android.content.Context
import android.content.SharedPreferences
import com.example.tactalk.R

class SessionManager (context: Context) {

    private var sharedPref: SharedPreferences = context.getSharedPreferences(context.getString(R.string.app_name), Context.MODE_PRIVATE)

    companion object {
        const val USER_TOKEN = "user_token"
    }

    // save token in shared preferences
    fun saveToken (token: String) {
        val prefEditor = sharedPref.edit()
        prefEditor.putString(USER_TOKEN, token)
        prefEditor.apply()
    }

    // extract the token
    fun getAuthToken(): String? {
        return sharedPref.getString(USER_TOKEN, null)
    }
}