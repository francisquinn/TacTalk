package com.example.recorddemo

import android.Manifest
import android.content.pm.PackageManager
import android.media.MediaRecorder
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.github.squti.androidwaverecorder.WaveRecorder
import java.io.IOException
import java.util.*
import kotlin.concurrent.fixedRateTimer
import kotlin.concurrent.scheduleAtFixedRate
import java.util.Timer
import kotlin.concurrent.schedule


class MainActivity : AppCompatActivity() {





    override fun onCreate(savedInstanceState: Bundle?) {


        val timer = Timer("schedule", true);
        var num = 0

        var fileName = "/audioFile$num.wav"
        var filePath:String = externalCacheDir?.absolutePath + fileName

        var waveRecorder = WaveRecorder(filePath)
        waveRecorder.waveConfig.sampleRate = 44100
        waveRecorder.noiseSuppressorActive = true

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val startButton : Button = findViewById(R.id.button_start_recording)
        val stopButton : Button = findViewById(R.id.button_stop_recording)


        startButton.setOnClickListener {
            if (ContextCompat.checkSelfPermission(this,
                    Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                val permissions = arrayOf(Manifest.permission.RECORD_AUDIO, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE)
                ActivityCompat.requestPermissions(this, permissions,0)
            } else {


//                    waveRecorder.startRecording()
//                    Toast.makeText(this, "Recording started!", Toast.LENGTH_SHORT).show()

//                timer.schedule(1) {
//                    println("startRecording!")
//                    waveRecorder.startRecording()
//                }
//
//                timer.schedule(5000) {
//                    waveRecorder.stopRecording()
//                    println("StopRecording")
//
//                }


                timer.scheduleAtFixedRate(5000,5000) {
                    waveRecorder.stopRecording()
                    println("StopRecording")
                    num++
                    fileName = "/audioFile$num.wav"
                    filePath = externalCacheDir?.absolutePath + fileName
                    waveRecorder = WaveRecorder(filePath)
                }

                timer.scheduleAtFixedRate(1,5000) {
                    println("startRecording!") 
                    waveRecorder.startRecording()
                }





            }
        }

        stopButton.setOnClickListener{
            waveRecorder.stopRecording()
            Toast.makeText(this, "Recording stopped!", Toast.LENGTH_SHORT).show()


        }




    }




}