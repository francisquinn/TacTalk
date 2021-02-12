package com.example.tactalk


import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.navigation.Navigation
import com.example.tactalk.activity.LoginFragment
import com.example.tactalk.activity.RegisterFragment

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_home_screen)

        val stopButton : Button = findViewById(R.id.GoMainMenu)
        val loginButton : Button = findViewById(R.id.btn_login_page)

        stopButton.setOnClickListener{
            Toast.makeText(this, "pressed!", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, MainMenuFragment::class.java))
        }

        loginButton.setOnClickListener {
            startActivity(Intent(this, LoginFragment::class.java))
        }
    }
}