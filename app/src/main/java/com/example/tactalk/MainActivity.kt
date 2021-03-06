package com.example.tactalk


import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import com.example.tactalk.login.LoginFragment
import com.example.tactalk.main.MainMenuFragment
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.team.CreateTeamFragment
import com.example.tactalk.team.CreateTeamResponse
import com.example.tactalk.team.ManageTeamFragment
import com.example.tactalk.team.TeamManager
import com.example.tactalk.user.UserFragment
import com.google.android.material.snackbar.Snackbar
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.fragment_create_team.*
import kotlinx.android.synthetic.main.fragment_set_up_match.*
import kotlinx.android.synthetic.main.fragment_set_up_match.edt_team_name
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

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
        setContentView(R.layout.activity_main)

        // TacTalk API
        val retrofit = RetrofitClient.getInstance()
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)
        teamManager = TeamManager(this)

        // check team method call
        checkTeamExists()

    }

    // check if user has a team
    private fun checkTeamExists() {

        val contextView: View = findViewById(R.id.content_view)

        // TacTalk API call
        // extract token
        tacTalkAPI.checkTeamExists(token = "${sessionManager.getAuthToken()}")
            .enqueue(object : Callback<CreateTeamResponse> {
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
                            // if user does not have a team
                            // redirect to the create team page
                            createTeamNav()
                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                        }
                    } else if (teamResponse != null) {
                        try {
                            // save team details
                            teamManager.saveTeam(
                                teamResponse.team_id,
                                teamResponse.team_name,
                                teamResponse.team_color,
                                teamResponse.team_level
                            )
                            // redirect to main menu
                            mainMenuNav()
                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                        }
                    }
                }
            })
    }

    private fun createTeamNav() {
        startActivity(Intent(this, CreateTeamFragment::class.java))
        finish()
    }

    private fun mainMenuNav() {
        startActivity(Intent(this, MainMenuFragment::class.java))
        finish()
    }
}