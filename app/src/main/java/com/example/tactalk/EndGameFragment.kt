package com.example.tactalk

import android.content.Intent
import android.net.Uri
import android.os.Bundle

import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.main.MainMenuFragment


class EndGameFragment : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_end_game)

        val homeButton : Button = findViewById(R.id.btn_home)
        val statButton : Button = findViewById(R.id.btn_stats)

        homeButton.setOnClickListener {
            startActivity(Intent(this, MainMenuFragment::class.java))
        }

        statButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://tactalk-rojak.herokuapp.com"))
            startActivity(intent)
        }
    }
}