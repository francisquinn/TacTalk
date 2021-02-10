package com.example.tactalk

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.widget.Toast
import android.view.ViewGroup
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.navigation.Navigation
import kotlinx.android.synthetic.main.fragment_home_screen.view.*
import kotlinx.android.synthetic.main.fragment_main_menu.view.*

class MainMenuFragment : AppCompatActivity(){

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_main_menu)

        val stopButton : Button = findViewById(R.id.Record)

        stopButton.setOnClickListener{
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
                startActivity(Intent(this, RecordingPageFragment::class.java))
            }
            //Toast.makeText(this, "pressed record!", Toast.LENGTH_SHORT).show()
        }
    }

    /*override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_main_menu, container, false)

        view.ManageTeam_button.setOnClickListener {
            Navigation.findNavController(view).navigate(R.id.MainMenuToManageTeam)
        }
        view.SetUpMatchButton.setOnClickListener {
            Navigation.findNavController(view).navigate(R.id.MainMenuToSetupMatch)
        }
        view.Record.setOnClickListener {
            Toast.makeText(view.context, "Recording started!", Toast.LENGTH_LONG).show()
            Navigation.findNavController(view).navigate(R.id.MainMenuToRecording)
        }
        return view
    }*/

}