package com.timothynguoi.mobileapplication

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.StrictMode
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import java.net.Socket


class MainActivity : AppCompatActivity() {

    private val RecordAudioRequestCode = 4000

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val button = findViewById<Button>(R.id.button_connect)
        button.setOnClickListener(
                {
                    val c = Client()
                    c.start()
                }
        )
    }


}