package com.example.tactalk.team

import android.content.Context
import android.content.SharedPreferences
import com.example.tactalk.R

class TeamManager (context: Context) {

    // shared preferences
    private var sharedPref: SharedPreferences = context.getSharedPreferences(context.getString(R.string.app_name), Context.MODE_PRIVATE)

    // key names
    companion object {
        const val ID = "team_id"
        const val NAME = "team_name"
        const val COLOUR = "team_colour"
        const val LEVEL = "team_level"
    }

    // store team in shared preferences
    fun saveTeam (team_id: String, name: String, colour: String, level: String) {
        val prefEditor = sharedPref.edit()
        prefEditor.putString(ID, team_id)
        prefEditor.putString(NAME, name)
        prefEditor.putString(COLOUR, colour)
        prefEditor.putString(LEVEL, level)
        prefEditor.apply()
    }

    // get team id
    fun getTeamID(): String? {
        return sharedPref.getString(ID, null)
    }

    // get team name
    fun getTeamName(): String? {
        return sharedPref.getString(NAME, null)
    }

    // get team colour
    fun getTeamColour(): String? {
        return sharedPref.getString(COLOUR, null)
    }

    // get team level
    fun getTeamLevel(): String?{
        return sharedPref.getString(LEVEL, null)
    }
}