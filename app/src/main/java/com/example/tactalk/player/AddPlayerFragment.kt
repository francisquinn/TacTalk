package com.example.tactalk.player

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.R
import com.example.tactalk.team.ManageTeamFragment
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.team.TeamManager
import com.example.tactalk.user.User
import com.example.tactalk.user.UserFragment
import com.github.ybq.android.spinkit.SpinKitView
import com.google.android.material.snackbar.Snackbar
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.fragment_add_player.*
import kotlinx.android.synthetic.main.fragment_user_page.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*
import kotlin.concurrent.timerTask

class AddPlayerFragment : AppCompatActivity() {

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
        setContentView(R.layout.fragment_add_player)

        val userPage: ImageView = findViewById(R.id.user_account)
        val backArrow: ImageView = findViewById(R.id.back_arrow)

        // TacTalk API
        val retrofit = RetrofitClient.getInstance()
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)
        teamManager = TeamManager(this)

        // user page
        userPage.setOnClickListener {
            startActivity(Intent(this, UserFragment::class.java))
        }

        // back button
        backArrow.setOnClickListener {
            finish()
        }
    }

    fun onClick(view: View) {
        when (view.id) {
            R.id.btn_add_player -> {
                addPlayer(
                    add_playerName.text.toString(),
                    add_playerNumber.text.toString()
                )
            }
        }

    }

    // add player method
    private fun addPlayer(playerName: String, playerNumber: String) {

        // show loader
        val loader: SpinKitView = findViewById(R.id.progress)
        loader.visibility = View.VISIBLE
        val contextView: View = findViewById(R.id.content_view)

        //TacTalk API call
        // get team and auth token
        tacTalkAPI.addPlayer(
            team_id = "${teamManager.getTeamID()}",
            playerName,
            playerNumber,
            token = "${sessionManager.getAuthToken()}"
        )
            .enqueue(object : Callback<PlayerResponse> {
                // handle failed response
                override fun onFailure(call: Call<PlayerResponse>, t: Throwable) {
                    Snackbar.make(contextView, t.message.toString(), 3000)
                        .setBackgroundTint(resources.getColor(R.color.green))
                        .show()
                    loader.visibility = View.GONE
                }

                // handle response
                override fun onResponse(
                    call: Call<PlayerResponse>,
                    response: Response<PlayerResponse>
                ) {
                    val playerResponse = response.body()
                    val errorResponse = response.errorBody()

                    if (errorResponse != null) {
                        try {
                            // display error message
                            val errorMessage = JSONObject(response.errorBody()!!.string())
                            Snackbar.make(contextView, errorMessage.getString("message"), 5000)
                                .setBackgroundTint(resources.getColor(R.color.red))
                                .show()
                            loader.visibility = View.GONE
                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                            loader.visibility = View.GONE
                        }
                    } else if (playerResponse != null) {
                        try {
                            // display success message
                            Snackbar.make(contextView, playerResponse.message, 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                            loader.visibility = View.GONE
                            Timer().schedule(timerTask {
                                addPlayerComplete()
                            }, 3000)
                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                            loader.visibility = View.GONE
                        }
                    }
                }
            })
    }

    // redirect
    private fun addPlayerComplete() {
        finish()
    }

}