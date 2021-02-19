package com.example.tactalk

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.Chronometer
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.res.ResourcesCompat
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

        // 15 second audio upload timer
        val recordingTimer = Timer()

        // file order number
        var num = 1

        // test file name with hardcoded game_id
        var fileName = "/60084b37e8c56c0978f5b004_$num.wav"

        // cache path & set up recorder
        var filePath: String = externalCacheDir?.absolutePath + fileName
        var waveRecorder = WaveRecorder(filePath)
        waveRecorder.waveConfig.sampleRate = 32000

        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_recording_page)

        // Match timer
        val clock: Chronometer = findViewById(R.id.match_time)
        clock.typeface = ResourcesCompat.getFont(this, R.font.orbitron_medium);
        clock.start()

        val stopButton: Button = findViewById(R.id.endHalf)
        val pauseButton: Button = findViewById(R.id.pause)
        audioRecordView = findViewById(R.id.audioRecordView)

        // wave animation
        val waveTimer = Timer()
        waveTimer.schedule(object : TimerTask() {
            override fun run() {
                waveRecorder.onAmplitudeListener = {
                    audioRecordView.update(it);
                }
            }
        }, 0, 100)

        // Stop the recorder at 15 seconds, upload the file from cache,
        // then start the recorder again
        recordingTimer.scheduleAtFixedRate(timerTask {
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
        recordingTimer.scheduleAtFixedRate(timerTask {
            waveRecorder.startRecording()
            Log.d("Recorder", "Recording started")
        }, 1, 15000)

        stopButton.setOnClickListener {
            recordingTimer.cancel()
            recordingTimer.purge()
            waveRecorder.stopRecording()
            clock.stop()
            cloudUploader(filePath, fileName, storageRef)
            Toast.makeText(this, "Recording stopped!", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, StatsFragment::class.java))
            finish()
        }

        var buttonState = true
        pauseButton.setOnClickListener {
            if (buttonState){
                pauseButton.setText(R.string.Start)
                buttonState= !buttonState
                waveRecorder.stopRecording()
                Log.d("Recorder", "Recording paused")
            } else {
                pauseButton.setText(R.string.Pause)
                buttonState= !buttonState
                waveRecorder.startRecording()
                Log.d("Recorder", "Recording Started after pause")
            }
        }

    }

    // function to upload audio file to the cloud
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

    // disable back button
    override fun onBackPressed() {}
}