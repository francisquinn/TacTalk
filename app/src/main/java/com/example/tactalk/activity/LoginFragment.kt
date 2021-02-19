package com.example.tactalk.activity

import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.Navigation
import com.example.tactalk.MainActivity
import com.example.tactalk.MainMenuFragment
import com.example.tactalk.R
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.network.RetrofitClient
import com.google.android.material.snackbar.Snackbar
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers

import kotlinx.android.synthetic.main.fragment_login.*
import kotlinx.android.synthetic.main.fragment_login.view.*
import retrofit2.HttpException
import java.util.*
import java.util.logging.Handler
import kotlin.concurrent.timerTask

class LoginFragment : AppCompatActivity() {


    lateinit var tacTalkAPI: TacTalkAPI
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear();
        super.onStop()
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_login)

        //API
        val retrofit = RetrofitClient.getInstance();
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)

    }

    fun onClick(view: View) {
        when (view.id) {
            R.id.btn_login -> {
                // go to login page
                loginUser(edt_email.text.toString(), edt_password.text.toString())
            }
            R.id.goRegister -> {
                // go to login page
                startActivity(Intent(this, RegisterFragment::class.java))
            }
        }
    }

    private fun loginUser(email: String, password: String) {
        val contextView: View = findViewById(R.id.content_view)
        //check empty
        if (TextUtils.isEmpty(email)) {
            Snackbar.make(contextView, "EMAIL CANNOT BE EMPTY", 5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
            return;
        }

        if (TextUtils.isEmpty(password)) {
            Snackbar.make(contextView, "PASSWORD CANNOT BE EMPTY", 5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
            return;
        }

        compositeDisposable.addAll(
            tacTalkAPI.loginUser(email, password)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe
                { result ->
                    displayErrorStatus(result)
                })


    }

    private fun displayErrorStatus(result: String) {
        val contextView: View = findViewById(R.id.content_view)

        val status: String = result.substring(8, 11)

        if (status == "400") {
            Snackbar.make(contextView, "INVALID EMAIL OR PASSWORD", 5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
        } else if (status == "500") {
            Snackbar.make(contextView, "CONNECTION FAILED", 5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()

        } else if (status == "200") {
            Snackbar.make(contextView, "LOGIN SUCCESSFUL", 3000)
                .setBackgroundTint(resources.getColor(R.color.green))
                .show()

            Timer().schedule(timerTask {
                loginComplete()
            }, 3000)

        }
    }

    private fun loginComplete() {
        startActivity(Intent(this, MainMenuFragment::class.java))
        finish()
    }
}