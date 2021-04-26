package com.example.tactalk.main

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import android.widget.Button
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.tactalk.R
import com.example.tactalk.team.CreateTeamFragment
import com.example.tactalk.match.SetUpMatchFragment
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.recording.RecordingPageFragment
import com.example.tactalk.team.ManageTeamFragment
import com.example.tactalk.user.User
import com.example.tactalk.user.UserFragment
import com.example.tactalk.user.UserManager
import com.google.android.material.snackbar.Snackbar
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.fragment_main_menu.*
import kotlinx.android.synthetic.main.fragment_user_page.user_name
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainMenuFragment : AppCompatActivity() {

    lateinit var tacTalkAPI: TacTalkAPI
    internal var compositeDisposable = CompositeDisposable()
    private lateinit var sessionManager: SessionManager
    private lateinit var userManager: UserManager

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_main_menu)

        //TacTalk API
        val retrofit = RetrofitClient.getInstance();
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)
        userManager = UserManager(this)

        // get user details
        getUserDetails()

        val recordButton: Button = findViewById(R.id.Record)
        val userPage: ImageView = findViewById(R.id.user_account)
        val setUpMatch: Button = findViewById(R.id.btn_setUpMatch)

        // start match button pressed
        recordButton.setOnClickListener {
            // check user permissions
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.RECORD_AUDIO
                ) != PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                val permissions = arrayOf(
                    Manifest.permission.RECORD_AUDIO,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE
                )
                ActivityCompat.requestPermissions(this, permissions, 0)
            } else {
                // pass the start time
                val timerVal = 0
                // pass the half context
                val halfText = "first"
                val intent = Intent(this, RecordingPageFragment::class.java)
                intent.putExtra("timerVal", timerVal)
                intent.putExtra("halfText", halfText)
                // redirect to the recording page
                startActivity(intent)
                finish()
            }
        }

        // user page
        userPage.setOnClickListener {
            startActivity(Intent(this, UserFragment::class.java))
        }

        // set up match page
        setUpMatch.setOnClickListener {
            startActivity(Intent(this, SetUpMatchFragment::class.java))
        }

        // manage team page
        manage_team.setOnClickListener {
            startActivity(Intent(this, ManageTeamFragment::class.java))
        }

        val matchSetup = intent.getStringExtra("match_setup")

        // check if match has been set up
        if (matchSetup == "set") {
            setUpMatch.setBackgroundColor(Color.parseColor("#D3D3D3"))
            setUpMatch.isEnabled = false
        } else {
            // disable start match button
            recordButton.setBackgroundColor(Color.parseColor("#D3D3D3"))
            recordButton.isEnabled = false
        }

    }

    // method to get user details
    private fun getUserDetails() {

        val contextView: View = findViewById(R.id.content_view)

        // API call
        tacTalkAPI.getUserDetails(token = "${sessionManager.getAuthToken()}")
            .enqueue(object : Callback<User> {
                // handle failed response
                override fun onFailure(call: Call<User>, t: Throwable) {
                    Snackbar.make(contextView, t.message.toString(), 5000)
                        .setBackgroundTint(resources.getColor(R.color.red))
                        .show()
                }

                // handle response
                override fun onResponse(
                    call: Call<User>,
                    response: Response<User>
                ) {
                    val userResponse = response.body()
                    val errorResponse = response.errorBody()

                    if (errorResponse != null) {
                        try {
                            // display error response
                            val errorMessage = JSONObject(response.errorBody()!!.string())
                            Snackbar.make(contextView, errorMessage.getString("message"), 5000)
                                .setBackgroundTint(resources.getColor(R.color.red))
                                .show()
                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 5000)
                                .setBackgroundTint(resources.getColor(R.color.red))
                                .show()
                        }
                    } else if (userResponse != null) {
                        try {
                            // display user first name
                            user_name.text = userResponse.first_name
                            // save user details
                            userManager.saveUser(
                                userResponse.user_id,
                                userResponse.first_name,
                                userResponse.last_name,
                                userResponse.email
                            )

                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 5000)
                                .setBackgroundTint(resources.getColor(R.color.red))
                                .show()
                        }
                    }
                }
            })
    }

    // disable back button
    override fun onBackPressed() {}
}