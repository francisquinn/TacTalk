package com.example.tactalk.match

import android.annotation.SuppressLint
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.main.MainMenuFragment
import com.example.tactalk.R
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.TacTalkAPI
import com.google.android.material.snackbar.Snackbar
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.fragment_login.*
import kotlinx.android.synthetic.main.fragment_main_menu.view.*
import kotlinx.android.synthetic.main.fragment_set_up_match.*
import kotlinx.android.synthetic.main.fragment_set_up_match.view.*
import retrofit2.HttpException
import java.util.*
import kotlin.concurrent.timerTask


class SetUpMatchFragment : AppCompatActivity() {

    lateinit var tacTalkAPI: TacTalkAPI
    private var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_set_up_match)

        val retrofit = RetrofitClient.getInstance()
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)

        val dialog1 = datePickerDialog()
        selectDate.setOnClickListener{
            dialog1.show()
        }

        val dialog2 = timePickerDialog()
        selectTime.setOnClickListener{
            dialog2.show()
        }

    }

    fun onClick(view: View) {
        when(view.id){
            R.id.btn_setUpMatch -> {
                setUpMatch(
                        edt_game_name.text.toString(),
                        chosen_game_type.toString(),
                        edt_team_name.text.toString(),
                        chosen_team_colour.toString(),
                        edt_opposition.text.toString(),
                        chosen_opp_colour.toString(),
                        edt_location.text.toString(),
                        chosen_public.toString(),
                        selectDate.toString(),
                        selectTime.toString()
                )
//                startActivity(Intent(this, MainMenuFragment::class.java))
//                finish()
            }
        }

    }

    @SuppressLint("SetTextI18n")
    fun datePickerDialog(): DatePickerDialog {
        val mcurrentTime: Calendar = Calendar.getInstance()
        val year = mcurrentTime.get(Calendar.YEAR)
        val month = mcurrentTime.get(Calendar.MONTH)
        val day = mcurrentTime.get(Calendar.DAY_OF_MONTH)

        val datePickerDialog = DatePickerDialog(this, { _, year, month, dayOfMonth ->
            selectedDate.text = String.format("%d / %d / %d", dayOfMonth, month + 1, year)
        }, year, month, day)

        return datePickerDialog
    }

    @SuppressLint("SetTextI18n")
    fun timePickerDialog(): TimePickerDialog {
        val mcurrentTime: Calendar = Calendar.getInstance()
        val hour = mcurrentTime.get(Calendar.HOUR_OF_DAY)
        val minute = mcurrentTime.get(Calendar.MINUTE)

        val mTimePicker = TimePickerDialog(this, { _, hourOfDay, minute ->
            selectedTime.text = String.format("%d : %d", hourOfDay, minute)
        }, hour, minute, false)

        return mTimePicker
    }

    private fun setUpMatch(gameName: String, gameType: String, teamName: String,
                           teamColor: String, opposition: String, oppColor: String,
                           location: String, public: String, startDate: String, startTime: String) {

        val contextView: View = findViewById(R.id.content_view)
        if (TextUtils.isEmpty(gameName)) {
            Snackbar.make(contextView, "GAME NAME CANNOT BE EMPTY",5000)
                    .setBackgroundTint(resources.getColor(R.color.red))
                    .show()
            return;
        }
//        if (TextUtils.isEmpty(gameType)) {
//            Snackbar.make(contextView, "USERNAME CANNOT BE EMPTY",5000)
//                    .setBackgroundTint(resources.getColor(R.color.red))
//                    .show()
//            return;
//        }

        if (TextUtils.isEmpty(teamName)) {
            Snackbar.make(contextView, "TEAM NAME CANNOT BE EMPTY",5000)
                    .setBackgroundTint(resources.getColor(R.color.red))
                    .show()
            return;
        }
        if (TextUtils.isEmpty(opposition)) {
            Snackbar.make(contextView, "OPPOSITION CANNOT BE EMPTY",5000)
                    .setBackgroundTint(resources.getColor(R.color.red))
                    .show()
            return;
        }
        if (TextUtils.isEmpty(location)) {
            Snackbar.make(contextView, "LOCATION CANNOT BE EMPTY",5000)
                    .setBackgroundTint(resources.getColor(R.color.red))
                    .show()
            return;
        }
        if (TextUtils.isEmpty(startDate)) {
            Snackbar.make(contextView, "START DATE CANNOT BE EMPTY",5000)
                    .setBackgroundTint(resources.getColor(R.color.red))
                    .show()
            return;
        }
        if (TextUtils.isEmpty(startTime)) {
            Snackbar.make(contextView, "START TIME CANNOT BE EMPTY",5000)
                    .setBackgroundTint(resources.getColor(R.color.red))
                    .show()
            return;
        }

        compositeDisposable.addAll(tacTalkAPI.setUpMatch(gameName, gameType, teamName, teamColor,
                opposition, oppColor, location, public, startDate, startTime)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe( { result ->
                    setUpMatchStatus(result)
                },
                        { error -> displayError(error) }
                )
        )
    }

    private fun displayError(error: Throwable) {
        val contextView: View = findViewById(R.id.content_view)
        val err = error as HttpException
        val errorBody: String = err.response()?.errorBody()!!.string()

        val errorMessage: String = errorBody.substring(21, 25)

        when (errorMessage) {
            "gameName" -> {
                Snackbar.make(contextView, "INVALID GAME NAME",5000)
                        .setBackgroundTint(resources.getColor(R.color.red))
                        .show()
            }
            "teamName" -> {
                Snackbar.make(contextView, "INVALID TEAM NAME",5000)
                        .setBackgroundTint(resources.getColor(R.color.red))
                        .show()
            }
            "opposition" -> {
                Snackbar.make(contextView, "INVALID OPPOSITION",5000)
                        .setBackgroundTint(resources.getColor(R.color.red))
                        .show()
            }

            "location" -> {
                Snackbar.make(contextView, "INVALID LOCATION",5000)
                        .setBackgroundTint(resources.getColor(R.color.red))
                        .show()
            }
        }
    }

    private fun setUpMatchStatus(result : String){
        val contextView: View = findViewById(R.id.content_view)

        val status: String = result.substring(8, 11)

        if (status == "200"){
            Snackbar.make(contextView, "SET UP MATCH SUCCESSFUL", 3000)
                    .setBackgroundTint(resources.getColor(R.color.green))
                    .show()

            Timer().schedule(timerTask {
                setUpMatchComplete()
            }, 3000)
        }
    }


    private fun setUpMatchComplete() {
        startActivity(Intent(this, MainMenuFragment::class.java))
        finish()
    }


}
