package com.example.tactalk.team

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.R
import com.example.tactalk.main.MainMenuFragment
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.player.AddPlayerFragment
import com.example.tactalk.player.AllPlayersResponse
import com.example.tactalk.user.User
import com.example.tactalk.user.UserFragment
import com.google.android.material.snackbar.Snackbar
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.fragment_manage_team.*
import kotlinx.android.synthetic.main.fragment_manage_team.back_arrow
import kotlinx.android.synthetic.main.fragment_user_page.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*
import kotlin.concurrent.timerTask

class ManageTeamFragment : AppCompatActivity() {

    lateinit var tacTalkAPI: TacTalkAPI
    internal var compositeDisposable = CompositeDisposable()
    private lateinit var sessionManager: SessionManager
    private lateinit var teamManager: TeamManager

    // value to check activity status
    var reload = 0

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onResume() {
        super.onResume()
        // check to reload page
        reload += 1
        if (reload == 2){
            refreshActivity()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_manage_team)

        //TacTalk API
        val retrofit = RetrofitClient.getInstance();
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)
        teamManager = TeamManager(this)

        // get players method call
        getAllPlayers()

        val userPage: ImageView = findViewById(R.id.user_account)

        // add player page
        add_player_btn.setOnClickListener {
            startActivity(Intent(this, AddPlayerFragment::class.java))
        }

        // user page
        userPage.setOnClickListener {
            startActivity(Intent(this, UserFragment::class.java))

        }

        // back arrow
        back_arrow.setOnClickListener {
            finish()
        }

    }

    // get players method
    private fun getAllPlayers() {

        val contextView: View = findViewById(R.id.content_view)

        tacTalkAPI.getAllPlayers(
            team_id = "${teamManager.getTeamID()}",
            token = "${sessionManager.getAuthToken()}"
        )
            .enqueue(object : Callback<AllPlayersResponse> {
                // handle failed response
                override fun onFailure(call: Call<AllPlayersResponse>, t: Throwable) {
                    Snackbar.make(contextView, t.message.toString(), 3000)
                        .setBackgroundTint(resources.getColor(R.color.green))
                        .show()
                }

                // handle response
                override fun onResponse(
                    call: Call<AllPlayersResponse>,
                    response: Response<AllPlayersResponse>
                ) {
                    val playersResponse = response.body()
                    val errorResponse = response.errorBody()

                    if (errorResponse != null) {
                        try {
                            // display empty player message
                            val errorMessage = JSONObject(response.errorBody()!!.string())
                            val errorDisplay = TextView(applicationContext)
                            errorDisplay.textSize = 15f
                            errorDisplay.text = errorMessage.getString("message")
                            errorDisplay.setTextColor(Color.WHITE)
                            errorDisplay.setPadding(0, 100, 0, 0)
                            players.addView(errorDisplay)

                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                        }
                    } else if (playersResponse != null) {
                        try {
                            // display players dynamically
                            for (element in playersResponse.result) {
                                val playerName = TextView(applicationContext)
                                val playerNumber = TextView(applicationContext)

                                playerName.textSize = 20f
                                playerName.text = element.player_name
                                playerName.setTextColor(Color.WHITE)
                                playerName.setPadding(0, 0, 0, 70)
                                players.addView(playerName)

                                playerNumber.textSize = 20f
                                playerNumber.text = element.player_number
                                playerNumber.setTextColor(Color.WHITE)
                                playerNumber.textAlignment = View.TEXT_ALIGNMENT_CENTER
                                playerNumber.setPadding(0, 0, 0, 70)
                                numbers.addView(playerNumber)
                            }

                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                        }
                    }
                }
            })
    }

    // refresh activity
    private fun refreshActivity() {
        recreate()
    }
}