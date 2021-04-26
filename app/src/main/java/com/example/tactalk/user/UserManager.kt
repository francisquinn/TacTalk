package com.example.tactalk.user

import android.content.Context
import android.content.SharedPreferences
import com.example.tactalk.R

class UserManager (context: Context) {

    private var sharedPref: SharedPreferences = context.getSharedPreferences(context.getString(R.string.app_name), Context.MODE_PRIVATE)

    companion object {
        const val ID = "user_id"
        const val FIRST_NAME = "user_first_name"
        const val LAST_NAME = "user_last_name"
        const val EMAIL = "user_email"
    }

    fun saveUser (user_id: String, first_name: String, last_name: String, email: String) {
        val prefEditor = sharedPref.edit()
        prefEditor.putString(ID, user_id)
        prefEditor.putString(FIRST_NAME, first_name)
        prefEditor.putString(LAST_NAME, last_name)
        prefEditor.putString(EMAIL, email)
        prefEditor.apply()
    }

    fun getUserFirstName(): String? {
        return sharedPref.getString(FIRST_NAME, null)
    }

    fun getUserLastName(): String? {
        return sharedPref.getString(LAST_NAME, null)
    }

    fun getUserFullName(): String? {
        val first = sharedPref.getString(FIRST_NAME, null)
        val last = sharedPref.getString(LAST_NAME, null)
        return "$first $last"
    }

    fun getUserEmail(): String? {
        return sharedPref.getString(EMAIL, null)
    }
}