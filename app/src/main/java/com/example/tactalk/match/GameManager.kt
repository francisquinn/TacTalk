package com.example.tactalk.match

import android.content.Context
import android.content.SharedPreferences
import com.example.tactalk.R

class GameManager (context: Context) {

    // reference shared preferences
    private var sharedPref: SharedPreferences = context.getSharedPreferences(context.getString(R.string.app_name), Context.MODE_PRIVATE)

    // key names
    companion object {
        const val ID = "game_id"
        const val TEAM_NAME = "team_name"
        const val OPPOSITION_NAME = "opposition_name"
    }

    // store game in shared preferences
    fun saveGame (game_id: String, team_name: String, opposition_name: String) {
        val prefEditor = sharedPref.edit()
        prefEditor.putString(ID, game_id)
        prefEditor.putString(TEAM_NAME, team_name)
        prefEditor.putString(OPPOSITION_NAME, opposition_name)
        prefEditor.apply()
    }

    // return the game id
    fun getGameID(): String? {
        return sharedPref.getString(ID, null)
    }

    // return the team name
    fun getTeamName(): String? {
        return sharedPref.getString(TEAM_NAME, null)
    }

    // return the opposition name
    fun getOppositionName(): String? {
        return sharedPref.getString(OPPOSITION_NAME, null)
    }
}