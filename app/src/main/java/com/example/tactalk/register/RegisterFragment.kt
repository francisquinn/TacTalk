package com.example.tactalk.register

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.R
import com.example.tactalk.login.LoginFragment
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.TacTalkAPI
import com.github.ybq.android.spinkit.SpinKitView
import com.google.android.material.snackbar.Snackbar
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.fragment_register.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*
import kotlin.concurrent.timerTask

class RegisterFragment : AppCompatActivity() {

    lateinit var tacTalkAPI: TacTalkAPI
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_register)

        // TacTalk API
        val retrofit = RetrofitClient.getInstance();
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)

    }

    fun onClick(view: View) {
        when (view.id) {
            R.id.btn_register -> {
                // call register method
                registerUser(
                    edt_first_name.text.toString(),
                    edt_last_name.text.toString(),
                    edt_email.text.toString(),
                    edt_password.text.toString()
                )
            }
            R.id.goLogin -> {
                // back to login page
                finish()
            }
        }
    }

    // register method
    private fun registerUser(firstName: String, lastName: String, email: String, password: String) {

        // loader display
        val loader: SpinKitView = findViewById(R.id.progress)
        loader.visibility = View.VISIBLE
        val contextView: View = findViewById(R.id.content_view)

        // check confirm password
        if (edt_password.text.toString() != edt_confirm_password.text.toString()) {
            Snackbar.make(contextView, "Passwords Do Not Match", 5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
            loader.visibility = View.GONE
        } else {
            // TacTalk API call
            tacTalkAPI.registerUser(firstName, lastName, email, password)
                .enqueue(object : Callback<RegisterResponse> {
                    // handle failed response
                    override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                        Snackbar.make(contextView, t.message.toString(), 3000)
                            .setBackgroundTint(resources.getColor(R.color.green))
                            .show()
                        loader.visibility = View.GONE
                    }

                    // handle response
                    override fun onResponse(
                        call: Call<RegisterResponse>,
                        response: Response<RegisterResponse>
                    ) {
                        val registerResponse = response.body()
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
                        } else if (registerResponse != null) {
                            try {
                                // display success message
                                Snackbar.make(contextView, registerResponse.message, 3000)
                                    .setBackgroundTint(resources.getColor(R.color.green))
                                    .show()
                                loader.visibility = View.GONE
                                Timer().schedule(timerTask {
                                    registerComplete()
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
    }

    // redirect
    private fun registerComplete() {
        finish()
    }
}