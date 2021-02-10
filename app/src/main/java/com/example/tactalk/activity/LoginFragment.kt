package com.example.tactalk.activity

import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.Navigation
import com.example.tactalk.MainActivity
import com.example.tactalk.R
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.network.RetrofitClient
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers

import kotlinx.android.synthetic.main.fragment_login.*
import kotlinx.android.synthetic.main.fragment_login.view.*

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
        when(view.id){
            R.id.btn_login -> {
                // go to login page
                loginUser(edt_email.text.toString(), edt_password.text.toString())
                startActivity(Intent(this, MainActivity::class.java))
            }
            R.id.goRegister -> {
                // go to login page
                startActivity(Intent(this, RegisterFragment::class.java))
                finish()
            }

        }

    }

    private fun loginUser(email: String, password: String) {
        //check empty
        if (TextUtils.isEmpty(email)){
            Toast.makeText(this@LoginFragment, "email can not be null or Empty", Toast.LENGTH_SHORT).show()
            return;
        }

        if (TextUtils.isEmpty(password)){
            Toast.makeText(this@LoginFragment, "Password can not be null or Empty", Toast.LENGTH_SHORT).show()
            return;
        }

        compositeDisposable.addAll(tacTalkAPI.loginUser(email, password)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                Toast.makeText(this@LoginFragment, "" +result, Toast.LENGTH_SHORT).show()
            })
    }
}