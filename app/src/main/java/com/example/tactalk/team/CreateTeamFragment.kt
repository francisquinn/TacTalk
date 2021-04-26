package com.example.tactalk.team

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.MainActivity
import com.example.tactalk.R
import com.example.tactalk.main.MainMenuFragment
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.user.UserFragment
import com.google.android.material.snackbar.Snackbar
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.fragment_create_team.*
import kotlinx.android.synthetic.main.fragment_set_up_match.edt_team_name
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*
import kotlin.concurrent.timerTask

class CreateTeamFragment : AppCompatActivity() {

    lateinit var tacTalkAPI: TacTalkAPI
    private var compositeDisposable = CompositeDisposable()
    private lateinit var sessionManager: SessionManager
    private lateinit var teamManager: TeamManager

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_create_team)

        // TacTalk API
        val retrofit = RetrofitClient.getInstance()
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)
        teamManager = TeamManager(this)

    }

    fun onClick(view: View) {
        when (view.id) {
            R.id.btn_add_team -> {
                // call create team method
                createTeam(
                    edt_team_name.text.toString(),
                    add_team_color.selectedItem.toString(),
                    add_team_level.selectedItem.toString()
                )
            }
        }
    }

    // create team method
    private fun createTeam(teamName: String, teamColor: String, teamLevel: String) {

        val contextView: View = findViewById(R.id.content_view)

        // TacTalk API call
        // extract auth token
        tacTalkAPI.createTeam(
            teamName,
            teamColor,
            teamLevel,
            token = "${sessionManager.getAuthToken()}"
        )
            .enqueue(object : Callback<CreateTeamResponse> {
                // handle failed response
                override fun onFailure(call: Call<CreateTeamResponse>, t: Throwable) {
                    Snackbar.make(contextView, t.message.toString(), 3000)
                        .setBackgroundTint(resources.getColor(R.color.green))
                        .show()
                }

                // handle response
                override fun onResponse(
                    call: Call<CreateTeamResponse>,
                    response: Response<CreateTeamResponse>
                ) {
                    val teamResponse = response.body()
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
                    } else if (teamResponse != null) {
                        try {
                            // save team details in shared preferences
                            teamManager.saveTeam(
                                teamResponse.team_id,
                                teamResponse.team_name,
                                teamResponse.team_color,
                                teamResponse.team_level
                            )
                            Snackbar.make(contextView, teamResponse.message, 5000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                            Timer().schedule(timerTask {
                                createTeamComplete()
                            }, 3000)
                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                        }
                    }
                }
            })
    }

    // direct to main menu
    private fun createTeamComplete(){
        startActivity(Intent(this, MainMenuFragment::class.java))
        finish()
    }

    // disable back button
    override fun onBackPressed() {}
}