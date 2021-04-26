package com.example.tactalk.match

import android.annotation.SuppressLint
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.main.MainMenuFragment
import com.example.tactalk.R
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.user.User
import com.google.android.material.snackbar.Snackbar
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.fragment_login.*
import kotlinx.android.synthetic.main.fragment_main_menu.view.*
import kotlinx.android.synthetic.main.fragment_set_up_match.*
import kotlinx.android.synthetic.main.fragment_set_up_match.view.*
import kotlinx.android.synthetic.main.fragment_user_page.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.HttpException
import retrofit2.Response
import java.util.*
import kotlin.concurrent.timerTask

class SetUpMatchFragment : AppCompatActivity() {

    lateinit var tacTalkAPI: TacTalkAPI
    private var compositeDisposable = CompositeDisposable()
    private lateinit var sessionManager: SessionManager
    private lateinit var gameManager: GameManager

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_set_up_match)

        val backArrow: ImageView = findViewById(R.id.back_arrow)

        // TacTalk API
        val retrofit = RetrofitClient.getInstance()
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)
        gameManager = GameManager(this)

        // date and time dialogs
        val dateDialog = datePickerDialog()
        selectDate.setOnClickListener {
            dateDialog.show()
        }

        val timeDialog = timePickerDialog()
        selectTime.setOnClickListener {
            timeDialog.show()
        }

        // back arrow press
        backArrow.setOnClickListener {
            finish()
        }
    }

    fun onClick(view: View) {
        when (view.id) {
            R.id.btn_setUpMatch -> {
                // done button pressed
                setUpMatch(
                    game_type.selectedItem.toString(),
                    edt_team_name.text.toString(),
                    team_colour.selectedItem.toString(),
                    edt_opposition.text.toString(),
                    opp_colour.selectedItem.toString(),
                    edt_location.text.toString(),
                    selectedDate.text.toString(),
                    selectedTime.text.toString()
                )
            }
        }

    }

    // date picker dialog
    @SuppressLint("SetTextI18n")
    fun datePickerDialog(): DatePickerDialog {
        val mcurrentTime: Calendar = Calendar.getInstance()
        val year = mcurrentTime.get(Calendar.YEAR)
        val month = mcurrentTime.get(Calendar.MONTH)
        val day = mcurrentTime.get(Calendar.DAY_OF_MONTH)

        val datePickerDialog = DatePickerDialog(this, { _, year, month, dayOfMonth ->
            selectedDate.text = String.format("%d/%d/%d", dayOfMonth, month + 1, year)
        }, year, month, day)

        return datePickerDialog
    }

    // time picker dialog
    @SuppressLint("SetTextI18n")
    fun timePickerDialog(): TimePickerDialog {
        val mcurrentTime: Calendar = Calendar.getInstance()
        val hour = mcurrentTime.get(Calendar.HOUR_OF_DAY)
        val minute = mcurrentTime.get(Calendar.MINUTE)

        val mTimePicker = TimePickerDialog(this, { _, hourOfDay, minute ->
            selectedTime.text = String.format("%d:%d", hourOfDay, minute)
        }, hour, minute, false)

        return mTimePicker
    }

    // set up the match method
    private fun setUpMatch(
        gameType: String, teamName: String,
        teamColor: String, opposition: String, oppColor: String,
        location: String, startDate: String, startTime: String
    ) {

        val contextView: View = findViewById(R.id.context_view)

        // TacTalk API call
        tacTalkAPI.setUpMatch(
            gameType, teamName, teamColor,
            opposition, oppColor, location, startDate, startTime,
            token = "${sessionManager.getAuthToken()}"
        ).enqueue(object : Callback<SetUpMatchResponse> {
            // handle failed response
            override fun onFailure(call: Call<SetUpMatchResponse>, t: Throwable) {
                Snackbar.make(contextView, t.message.toString(), 5000)
                    .setBackgroundTint(resources.getColor(R.color.red))
                    .show()
            }

            // handle response
            override fun onResponse(
                call: Call<SetUpMatchResponse>,
                response: Response<SetUpMatchResponse>
            ) {
                val matchResponse = response.body()
                val errorResponse = response.errorBody()

                if (errorResponse != null) {
                    try {
                        // display error message
                        val errorMessage = JSONObject(response.errorBody()!!.string())
                        Snackbar.make(contextView, errorMessage.getString("message"), 5000)
                            .setBackgroundTint(resources.getColor(R.color.red))
                            .show()

                    } catch (e: Exception) {
                        Snackbar.make(contextView, e.message.toString(), 5000)
                            .setBackgroundTint(resources.getColor(R.color.red))
                            .show()
                    }
                } else if (matchResponse != null) {
                    try {
                        // display success message
                        Snackbar.make(contextView, matchResponse.message, 5000)
                            .setBackgroundTint(resources.getColor(R.color.green))
                            .show()

                        // save the game details in shared preferences
                        gameManager.saveGame(
                            matchResponse.game_id,
                            matchResponse.team_name,
                            matchResponse.opposition
                        )

                        // redirect main menu
                        Timer().schedule(timerTask {
                            setUpMatchComplete()
                        }, 3000)

                    } catch (e: Exception) {
                        Snackbar.make(contextView, e.message.toString(), 5000)
                            .setBackgroundTint(resources.getColor(R.color.red))
                            .show()
                    }
                }
            }
        })
    }

    // redirect method
    private fun setUpMatchComplete() {
        val intent = Intent(this, MainMenuFragment::class.java)
        // match has been set
        intent.putExtra("match_setup", "set")
        startActivity(intent)
        finish()
    }

}
