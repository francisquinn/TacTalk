package com.example.tactalk.statistics

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isInvisible
import com.example.tactalk.end.EndGameFragment
import com.example.tactalk.R
import com.example.tactalk.match.GameManager
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.recording.RecordingPageFragment
import com.google.android.material.snackbar.Snackbar

import kotlinx.android.synthetic.main.fragment_recording_page.*
import kotlinx.android.synthetic.main.fragment_statistics.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class StatisticFragment : AppCompatActivity() {

    lateinit var tacTalkAPI: TacTalkAPI
    private lateinit var sessionManager: SessionManager
    private lateinit var gameManager: GameManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_statistics)

        // TacTalk API
        val retrofit = RetrofitClient.getInstance()
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)
        gameManager = GameManager(this)

        // get statistics call
        getMatchStatistics()

        val teamName = gameManager.getTeamName()
        val oppTeamName = gameManager.getOppositionName()

        val teamNameDisplay: TextView = findViewById(R.id.team_name)
        val oppTeamDisplay: TextView = findViewById(R.id.opposition_team_name)

        // display team names
        teamNameDisplay.text = teamName
        oppTeamDisplay.text = oppTeamName

        team_table_text.text = teamName
        oppTeam_table_text.text = oppTeamName

        val secondHalf: Button = findViewById(R.id.second_half)
        val endGame: Button = findViewById(R.id.end_game)
        val halfTextDisplay: TextView = findViewById(R.id.half_text)

        val statPage = intent.getStringExtra("statPage")

        if (statPage != null) {

            // check half status
            if (statPage == "half") {
                secondHalf.visibility = View.VISIBLE
                endGame.visibility = View.GONE

                halfTextDisplay.text = "1st Half"

                // display second half button
                secondHalf.setOnClickListener {
                    // set second half timer
                    val timerVal = 2100000
                    val halfText = "second"
                    val intent = Intent(this, RecordingPageFragment::class.java)
                    intent.putExtra("timerVal", timerVal)
                    intent.putExtra("halfText", halfText)
                    startActivity(intent)
                    finish()
                }

            } else if (statPage == "full") {
                secondHalf.visibility = View.GONE
                endGame.visibility = View.VISIBLE

                halfTextDisplay.text = "2nd Half"

                // display end game button
                endGame.setOnClickListener {
                    startActivity(Intent(this, EndGameFragment::class.java))
                }

            }
        }

        //Tables that hold the stats
        tablePossession.isInvisible = false

        tableKickout.isInvisible = true

        tableZone.isInvisible = true
        //Text views
        kickout_text.isInvisible = true
        possession_text.isInvisible = false
        position_text.isInvisible = true


        radioButton.setOnClickListener {
            if (radioButton.isChecked) {
                // to make the tables invisible
                tablePossession.isInvisible = false
                tableKickout.isInvisible = true
                tableZone.isInvisible = true

                //For the text view titles
                kickout_text.isInvisible = true
                possession_text.isInvisible = false
                position_text.isInvisible = true
            } else if (radioButton2.isChecked) {

                tablePossession.isInvisible = true
                tableKickout.isInvisible = false
                tableZone.isInvisible = true


                //For the text view titles
                kickout_text.isInvisible = false
                possession_text.isInvisible = true
                position_text.isInvisible = true
            } else if (radioButton3.isChecked) {
                tablePossession.isInvisible = true
                tableKickout.isInvisible = true
                tableZone.isInvisible = false


                //For the text view titles
                kickout_text.isInvisible = true
                possession_text.isInvisible = true
                position_text.isInvisible = false
            }
        }

        radioButton2.setOnClickListener() {
            if (radioButton.isChecked) {
                // to make the tables invisible
                tablePossession.isInvisible = false
                tableKickout.isInvisible = true
                tableZone.isInvisible = true

                //For the text view titles
                kickout_text.isInvisible = true
                possession_text.isInvisible = false
                position_text.isInvisible = true
            } else if (radioButton2.isChecked) {

                tablePossession.isInvisible = true
                tableKickout.isInvisible = false
                tableZone.isInvisible = true


                //For the text view titles
                kickout_text.isInvisible = false
                possession_text.isInvisible = true
                position_text.isInvisible = true
            } else if (radioButton3.isChecked) {
                tablePossession.isInvisible = true
                tableKickout.isInvisible = true
                tableZone.isInvisible = false


                //For the text view titles
                kickout_text.isInvisible = true
                possession_text.isInvisible = true
                position_text.isInvisible = false
            }
        }
        radioButton3.setOnClickListener() {
            if (radioButton.isChecked) {
                // to make the tables invisible
                tablePossession.isInvisible = false
                tableKickout.isInvisible = true
                tableZone.isInvisible = true

                //For the text view titles
                kickout_text.isInvisible = true
                possession_text.isInvisible = false
                position_text.isInvisible = true
            } else if (radioButton2.isChecked) {

                tablePossession.isInvisible = true
                tableKickout.isInvisible = false
                tableZone.isInvisible = true

                //For the text view titles
                kickout_text.isInvisible = false
                possession_text.isInvisible = true
                position_text.isInvisible = true
            } else if (radioButton3.isChecked) {
                tablePossession.isInvisible = true
                tableKickout.isInvisible = true
                tableZone.isInvisible = false


                //For the text view titles
                kickout_text.isInvisible = true
                possession_text.isInvisible = true
                position_text.isInvisible = false
            }
        }

    }

    // staistics call
    private fun getMatchStatistics() {

        val contextView: View = findViewById(R.id.content_view)

        // TacTalk API call
        // extract game id and auth token
        tacTalkAPI.getMatchStatistics(
            game_id = "${gameManager.getGameID()}",
            token = "${sessionManager.getAuthToken()}"
        ).enqueue(object : Callback<StatsProperty> {
            // handle failed response
            override fun onFailure(call: Call<StatsProperty>, t: Throwable) {
                Snackbar.make(contextView, t.message.toString(), 3000)
                    .setBackgroundTint(resources.getColor(R.color.green))
                    .show()
            }

            // handle response
            override fun onResponse(
                call: Call<StatsProperty>,
                response: Response<StatsProperty>
            ) {
                val statsResponse = response.body()
                val errorResponse = response.errorBody()

                if (errorResponse != null) {
                    try {
                        // display error message
                        val errorMessage = JSONObject(response.errorBody()!!.string())
                        Snackbar.make(contextView, errorMessage.getString("message"), 5000)
                            .setBackgroundTint(resources.getColor(R.color.red))
                            .show()
                    } catch (e: Exception) {
                        Snackbar.make(contextView, e.message.toString(), 3000)
                            .setBackgroundTint(resources.getColor(R.color.green))
                            .show()
                    }
                } else if (statsResponse != null) {
                    try {
                        // display statistics
                        // home team goals and points and score
                        val teamGoalsDisplay: TextView = findViewById(R.id.team_goals)
                        val teamPointsDisplay: TextView = findViewById(R.id.team_points)

                        val teamScoreDispaly: TextView = findViewById(R.id.team_score)

                        val teamGoals = statsResponse.result.teamGoal * 3
                        val teamPoints = statsResponse.result.teamPoints
                        val teamScore = teamGoals + teamPoints

                        teamGoalsDisplay.text = statsResponse.result.teamGoal.toString()
                        teamPointsDisplay.text = teamPoints.toString()
                        teamScoreDispaly.text = teamScore.toString()

                        // opposition goals and points
                        val oppTeamGoalsDisplay: TextView = findViewById(R.id.opp_team_goals)
                        val oppTeamPointsDisplay: TextView = findViewById(R.id.opp_team_points)

                        val oppTeamScoreDisplay: TextView = findViewById(R.id.opp_team_score)

                        val oppTeamGoals = statsResponse.result.oppTeamGoal * 3
                        val oppTeamPoints = statsResponse.result.oppTeamPoints
                        val oppTeamScore = oppTeamGoals + oppTeamPoints

                        oppTeamGoalsDisplay.text = statsResponse.result.oppTeamGoal.toString()
                        oppTeamPointsDisplay.text = oppTeamPoints.toString()
                        oppTeamScoreDisplay.text = oppTeamScore.toString()

                        // shots
                        val teamShotsDisplay: TextView = findViewById(R.id.team_shots_table)
                        teamShotsDisplay.text = statsResponse.result.teamShots.toString()

                        val oppTeamShotDisplay: TextView = findViewById(R.id.opp_team_shots_table)
                        oppTeamShotDisplay.text = statsResponse.result.oppTeamShots.toString()

                        // wides
                        val teamWidesDisplay: TextView = findViewById(R.id.team_wides)
                        teamWidesDisplay.text = statsResponse.result.teamWides.toString()

                        val oppTeamWidesDisplay: TextView = findViewById(R.id.opp_team_wides)
                        oppTeamWidesDisplay.text = statsResponse.result.oppTeamWides.toString()

                        // possession
                        val teamPossessionDisplay: TextView = findViewById(R.id.team_possession)
                        teamPossessionDisplay.text = statsResponse.result.teamPossession.toString()

                        val oppTeamPossessionDisplay: TextView =
                            findViewById(R.id.opp_team_possession)
                        oppTeamPossessionDisplay.text =
                            statsResponse.result.oppTeamPossession.toString()

                        // pass completion
                        val teamPassDisplay: TextView = findViewById(R.id.team_pass_completion)
                        teamPassDisplay.text = statsResponse.result.teamPassCompletion.toString()

                        val oppTeamPassDisplay: TextView =
                            findViewById(R.id.opp_team_pass_completion)
                        oppTeamPassDisplay.text =
                            statsResponse.result.oppTeamPassCompletion.toString()

                        // shot conversion
                        val teamShotConversionDisplay: TextView =
                            findViewById(R.id.team_shot_conversion)
                        teamShotConversionDisplay.text =
                            statsResponse.result.teamShotConversion.toString()

                        val oppTeamShotConversionDisplay: TextView =
                            findViewById(R.id.opp_team_shot_conversion)
                        oppTeamShotConversionDisplay.text =
                            statsResponse.result.oppTeamShotConversion.toString()

                        // kickouts
                        val teamKickoutDisplay: TextView = findViewById(R.id.team_kickouts)
                        teamKickoutDisplay.text = statsResponse.result.teamKickouts.toString()

                        val oppTeamKickoutDisplay: TextView = findViewById(R.id.opp_team_kickouts)
                        oppTeamKickoutDisplay.text = statsResponse.result.oppTeamKickouts.toString()

                        // turnovers
                        val teamTurnoverDisplay: TextView = findViewById(R.id.team_turnovers)
                        teamTurnoverDisplay.text = statsResponse.result.teamTurnover.toString()

                        val oppTeamTurnoverDisplay: TextView = findViewById(R.id.opp_team_turnovers)
                        oppTeamTurnoverDisplay.text =
                            statsResponse.result.oppTeamTurnover.toString()

                        // kickouts won
                        val teamKickoutsWonDisplay: TextView = findViewById(R.id.team_kickouts_won)
                        teamKickoutsWonDisplay.text =
                            statsResponse.result.teamKickoutsWon.toString()

                        val oppTeamKickoutsWonDisplay: TextView =
                            findViewById(R.id.opp_team_kickouts_won)
                        oppTeamKickoutsWonDisplay.text =
                            statsResponse.result.oppTeamKickoutsWon.toString()

                        // kickout zone
                        val teamKickoutZoneDisplay: TextView = findViewById(R.id.team_zone_kickout)
                        teamKickoutZoneDisplay.text =
                            statsResponse.result.teamZoneWithMostKickouts.toString()

                        val oppTeamKickoutZoneDisplay: TextView =
                            findViewById(R.id.opp_team_zone_kickout)
                        oppTeamKickoutZoneDisplay.text =
                            statsResponse.result.oppTeamZoneWithMostKickouts.toString()

                        // shot zone
                        val teamShotZoneDisplay: TextView = findViewById(R.id.team_zone_shots)
                        teamShotZoneDisplay.text =
                            statsResponse.result.teamZoneWithMostShots.toString()

                        val oppTeamShotZoneDisplay: TextView =
                            findViewById(R.id.opp_team_zone_shots)
                        oppTeamShotZoneDisplay.text =
                            statsResponse.result.oppTeamZoneWithMostShots.toString()

                    } catch (e: Exception) {
                        Snackbar.make(contextView, e.message.toString(), 3000)
                            .setBackgroundTint(resources.getColor(R.color.green))
                            .show()
                    }
                }
            }
        })
    }

    override fun onBackPressed() {}
}