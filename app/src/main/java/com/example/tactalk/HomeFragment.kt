package com.example.tactalk

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.main.MainMenuFragment

class HomeFragment : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_home_screen)

        val test : Button = findViewById(R.id.GoMainMenu)
        val loginButton : Button = findViewById(R.id.btn_login_page)

        test.setOnClickListener {
            Toast.makeText(this, "pressed!", Toast.LENGTH_SHORT).show()
        }

        loginButton.setOnClickListener {
            startActivity(Intent(this, MainMenuFragment::class.java))
        }

    }
}