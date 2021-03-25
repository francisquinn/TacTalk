package com.example.tactalk.register

import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.R
import com.example.tactalk.login.LoginFragment
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.TacTalkAPI
import com.google.android.material.snackbar.Snackbar
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.fragment_register.*
import retrofit2.HttpException
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

        val retrofit = RetrofitClient.getInstance();
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)

    }


    fun onClick(view: View) {
        when (view.id) {
            R.id.btn_register -> {

                registerUser(
                    edt_name.text.toString(),
                    edt_email.text.toString(),
                    edt_password.text.toString()
                )

                //startActivity(Intent(this, MainActivity::class.java))
                //finish()
            }
            R.id.goLogin -> {
                startActivity(Intent(this, LoginFragment::class.java))
                finish()
            }
        }
    }


    private fun registerUser(name: String, email: String, password: String) {
        val contextView: View = findViewById(R.id.content_view)
        if (TextUtils.isEmpty(name)) {
            Snackbar.make(contextView, "USERNAME CANNOT BE EMPTY",5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
            return;
        }

        if (TextUtils.isEmpty(email)) {
            Snackbar.make(contextView, "EMAIL CANNOT BE EMPTY",5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
            return;
        }

        if (TextUtils.isEmpty(password)) {
            Snackbar.make(contextView, "PASSWORD CANNOT BE EMPTY",5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
            return;
        }

            compositeDisposable.addAll(tacTalkAPI.registerUser(name, email, password)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    { result ->
                        registerStatus(result)
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

        if (errorMessage == "Name"){
            Snackbar.make(contextView, "INVALID USERNAME",5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
        } else if (errorMessage == "Emai"){
            Snackbar.make(contextView, "INVALID EMAIL",5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
        } else if (errorMessage == "Pass"){
            Snackbar.make(contextView, "INVALID PASSWORD",5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
        }
    }

    private fun registerStatus(result : String){
        val contextView: View = findViewById(R.id.content_view)

        val status: String = result.substring(8, 11)

        if (status == "200"){
            Snackbar.make(contextView, "REGISTER SUCCESSFUL", 3000)
                .setBackgroundTint(resources.getColor(R.color.green))
                .show()

            Timer().schedule(timerTask {
                registerComplete()
            }, 3000)
        }
    }


    private fun registerComplete() {
        startActivity(Intent(this, LoginFragment::class.java))
        finish()
    }
}