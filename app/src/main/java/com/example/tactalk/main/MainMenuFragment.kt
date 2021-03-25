package com.example.tactalk.main

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import android.widget.Button
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.tactalk.R
import com.example.tactalk.match.SetUpMatchFragment
import com.example.tactalk.recording.RecordingPageFragment
import com.example.tactalk.user.UserFragment

class MainMenuFragment : AppCompatActivity(){

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_main_menu)

        val recordButton : Button = findViewById(R.id.Record)
        val userPage : ImageView = findViewById(R.id.user_account)
        val setUpMatch : Button = findViewById(R.id.btn_setUpMatch)

        recordButton.setOnClickListener{
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.RECORD_AUDIO
                ) != PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                val permissions = arrayOf(
                    Manifest.permission.RECORD_AUDIO,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE
                )
                ActivityCompat.requestPermissions(this, permissions, 0)
            } else {
                //startActivity(Intent(this, RecordingPageFragment::class.java))
                val timerVal = 0
                val intent = Intent(this, RecordingPageFragment::class.java)
                intent.putExtra("timerVal", timerVal)
                startActivity(intent)
                finish()
            }
            //Toast.makeText(this, "pressed record!", Toast.LENGTH_SHORT).show()
        }

        userPage.setOnClickListener {
            startActivity(Intent(this, UserFragment::class.java))
            Toast.makeText(this, "user touched", Toast.LENGTH_SHORT).show()
        }

        setUpMatch.setOnClickListener {
            startActivity(Intent(this, SetUpMatchFragment::class.java))
            Toast.makeText(this, "set up touched", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onBackPressed() {}
}