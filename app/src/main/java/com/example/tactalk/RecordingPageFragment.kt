package com.example.tactalk

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.github.squti.androidwaverecorder.WaveRecorder
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.ktx.storage
import com.google.firebase.storage.ktx.storageMetadata
import com.visualizer.amplitude.AudioRecordView
import java.io.File
import com.google.firebase.storage.ktx.component1
import com.google.firebase.storage.ktx.component2
import java.util.*
import kotlin.concurrent.timerTask

class RecordingPageFragment : AppCompatActivity() {

    lateinit var storage: FirebaseStorage
    private lateinit var audioRecordView: AudioRecordView

    override fun onCreate(savedInstanceState: Bundle?) {

        // Google Cloud Storage Bucket
        storage = Firebase.storage("gs://tactalk-bucket")

        // Points to the root reference
        val storageRef = storage.reference

        val timer = Timer()
        var num = 0

        var fileName = "/60084b37e8c56c0978f5b004_$num.wav"

        var filePath: String = externalCacheDir?.absolutePath + fileName
        var waveRecorder = WaveRecorder(filePath)
        waveRecorder.waveConfig.sampleRate = 32000

        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_recording_page)

        val stopButton: Button = findViewById(R.id.endHalf)
        val pauseButton: Button = findViewById(R.id.pause)
        audioRecordView = findViewById(R.id.audioRecordView)

        val waveTimer = Timer()
        waveTimer?.schedule(object : TimerTask() {
            override fun run() {
                waveRecorder.onAmplitudeListener = {
                    //Log.d("Recorder", "Amplitude : $it")
                    audioRecordView.update(it);
                }
            }
        }, 0, 100)

        // Stop the recorder at 15 seconds, upload the file from cache,
        // then start the recorder again
        timer.scheduleAtFixedRate(timerTask {
            Log.d("Recorder", "Recording stopped")
            waveRecorder.stopRecording()
            println("StopRecording")

            cloudUploader(filePath, fileName, storageRef)

            num++
            fileName = "/60084b37e8c56c0978f5b004_$num.wav"
            filePath = externalCacheDir?.absolutePath + fileName
            waveRecorder = WaveRecorder(filePath)
            waveRecorder.waveConfig.sampleRate = 32000
        }, 15000, 15000)

        // start recorded once the activity is created
        timer.scheduleAtFixedRate(timerTask {
            waveRecorder.startRecording()
            Log.d("Recorder", "Recording started")
        }, 1, 15000)

        stopButton.setOnClickListener {
            timer.cancel()
            timer.purge()
            waveRecorder.stopRecording()
            cloudUploader(filePath, fileName, storageRef)
            Toast.makeText(this, "Recording stopped!", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, StatsFragment::class.java))
            finish()
        }

        pauseButton.setOnClickListener {
            Toast.makeText(this, "Paused button pressed", Toast.LENGTH_SHORT).show()
        }

    }

    private fun cloudUploader(filePath:String, fileName:String, storageRef: StorageReference){
        // Retrieve the file from the filePath
        val file = Uri.fromFile(File(filePath))

        // Type of metadata
        val metadata = storageMetadata {
            contentType = "audio/wav"
        }

        Log.d("Recorder", "Uploading to the cloud...")

        // Upload to the Bucket
        val uploadTask = storageRef.child(fileName).putFile(file, metadata)

        // Listen for state changes, errors, and completion of the upload.
        // You'll need to import com.google.firebase.storage.ktx.component1 and
        // com.google.firebase.storage.ktx.component2
        uploadTask.addOnProgressListener { (bytesTransferred, totalByteCount) ->
            val progress = (100.0 * bytesTransferred) / totalByteCount
            Log.d("Recorder", "Upload is $progress% done")
        }.addOnPausedListener {
            Log.d("Recorder", "Upload is paused")
        }.addOnFailureListener {
            // Handle unsuccessful uploads
        }.addOnSuccessListener {

        }
    }

    override fun onBackPressed() {}
}