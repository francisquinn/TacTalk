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

import kotlinx.android.synthetic.main.fragment_login.view.*
import kotlinx.android.synthetic.main.fragment_register.*
import kotlinx.android.synthetic.main.fragment_register.view.*


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
                registerUser(edt_name.text.toString(), edt_email.text.toString(), edt_password.text.toString())
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            }
            R.id.goLogin -> {
                startActivity(Intent(this, LoginFragment::class.java))
                finish()
            }
        }
    }



    private fun registerUser(name: String, email: String, password: String) {

        if (TextUtils.isEmpty(name)) {
            Toast.makeText(this@RegisterFragment, "Name can not be null or Empty", Toast.LENGTH_SHORT).show()
            return;
        }

        if (TextUtils.isEmpty(email)) {
            Toast.makeText(this@RegisterFragment, "Email can not be null or Empty", Toast.LENGTH_SHORT).show()
            return;
        }

        if (TextUtils.isEmpty(password)) {
            Toast.makeText(this@RegisterFragment, "Password can not be null or Empty", Toast.LENGTH_SHORT).show()
            return;
        }

        compositeDisposable.addAll(tacTalkAPI.registerUser(name, email, password)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe { result ->
                    Toast.makeText(this@RegisterFragment, "" + result, Toast.LENGTH_SHORT).show()
                })
    }

}