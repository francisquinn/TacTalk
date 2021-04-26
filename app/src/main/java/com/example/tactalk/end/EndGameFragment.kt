package com.example.tactalk.end

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.R
import com.example.tactalk.main.MainMenuFragment
import com.example.tactalk.user.UserFragment
import kotlinx.android.synthetic.main.fragment_end_game.*


class EndGameFragment : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_end_game)

        val homeButton : Button = findViewById(R.id.btn_home)
        val statButton : Button = findViewById(R.id.btn_stats)

        // redirect to the main menu page
        homeButton.setOnClickListener {
            startActivity(Intent(this, MainMenuFragment::class.java))
            finish()
        }

        // future button to view statistics after match
        statButton.setOnClickListener {
            val intent = Intent(
                Intent.ACTION_VIEW,
                Uri.parse("https://tactalk-rojak.herokuapp.com")
            )
            startActivity(intent)
        }

        // user page
        user_account.setOnClickListener {
            startActivity(Intent(this, UserFragment::class.java))
        }
    }

    override fun onBackPressed() {}
}