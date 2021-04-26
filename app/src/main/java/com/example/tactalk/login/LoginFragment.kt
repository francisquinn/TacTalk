package com.example.tactalk.login

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.MainActivity
import com.example.tactalk.R
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.register.RegisterFragment
import com.github.ybq.android.spinkit.SpinKitView
import com.google.android.material.snackbar.Snackbar
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.fragment_login.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*
import kotlin.concurrent.timerTask


class LoginFragment : AppCompatActivity() {

    lateinit var tacTalkAPI: TacTalkAPI
    internal var compositeDisposable = CompositeDisposable()
    private lateinit var sessionManager: SessionManager

    override fun onStop() {
        compositeDisposable.clear();
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_login)

        //TacTalk API
        val retrofit = RetrofitClient.getInstance();
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)
    }

    fun onClick(view: View) {
        when (view.id) {
            R.id.btn_login -> {
                // login button pressed
                loginUser(edt_email.text.toString(), edt_password.text.toString())
            }
            R.id.goRegister -> {
                // sign up text pressed
                startActivity(Intent(this, RegisterFragment::class.java))
            }
        }
    }

    // method to login a user
    private fun loginUser(email: String, password: String) {

        // loader visibility
        val loader: SpinKitView = findViewById(R.id.progress)
        loader.visibility = View.VISIBLE

        // view context
        val contextView: View = findViewById(R.id.content_view)

        // TacTalk API call to login a user
        tacTalkAPI.loginUser(email, password)
            .enqueue(object : Callback<LoginResponse> {
                override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                    // display failed response
                    Snackbar.make(contextView, t.message.toString(), 5000)
                        .setBackgroundTint(resources.getColor(R.color.red))
                        .show()
                    loader.visibility = View.GONE
                }

                override fun onResponse(
                    call: Call<LoginResponse>,
                    response: Response<LoginResponse>
                ) {
                    val loginResponse = response.body()
                    val errorResponse = response.errorBody()

                    if (errorResponse != null) {
                        try {
                            // display the error response
                            val errorMessage = JSONObject(response.errorBody()!!.string())
                            Snackbar.make(contextView, errorMessage.getString("message"), 5000)
                                .setBackgroundTint(resources.getColor(R.color.red))
                                .show()
                            loader.visibility = View.GONE
                        } catch (e: Exception) {
                            Snackbar.make(contextView, e.message.toString(), 5000)
                                .setBackgroundTint(resources.getColor(R.color.red))
                                .show()
                            loader.visibility = View.GONE
                        }
                    } else if (loginResponse != null) {
                        try {
                            // display the success response
                            Snackbar.make(contextView, loginResponse.message, 3000)
                                .setBackgroundTint(resources.getColor(R.color.green))
                                .show()
                            // save the user token
                            sessionManager.saveToken(loginResponse.token)
                            // remove the loader
                            loader.visibility = View.GONE
                            // redirect to the main activity
                            Timer().schedule(timerTask {
                                loginComplete()
                            }, 3000)
                        } catch (e: Exception) {
                            Log.i("responseLogin", e.message.toString())
                            Snackbar.make(contextView, e.message.toString(), 5000)
                                .setBackgroundTint(resources.getColor(R.color.red))
                                .show()
                            loader.visibility = View.GONE
                        }
                    }
                }
            })
    }

    // method ro redirect to main activity
    private fun loginComplete() {
        startActivity(Intent(this, MainActivity::class.java))

    }
}