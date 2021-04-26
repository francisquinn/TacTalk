package com.example.tactalk.recording

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.SystemClock
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.Chronometer
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.res.ResourcesCompat
import com.example.tactalk.R
import com.example.tactalk.match.GameManager
import com.example.tactalk.network.RetrofitClient
import com.example.tactalk.network.SessionManager
import com.example.tactalk.network.TacTalkAPI
import com.example.tactalk.statistics.StatisticFragment
import com.example.tactalk.statistics.StatsProperty
import com.github.squti.androidwaverecorder.WaveRecorder
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.ktx.component1
import com.google.firebase.storage.ktx.component2
import com.google.firebase.storage.ktx.storage
import com.google.firebase.storage.ktx.storageMetadata
import com.visualizer.amplitude.AudioRecordView
import kotlinx.android.synthetic.main.fragment_recording_page.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File
import java.util.*
import kotlin.concurrent.timerTask

class RecordingPageFragment : AppCompatActivity() {

    lateinit var storage: FirebaseStorage
    lateinit var tacTalkAPI: TacTalkAPI
    private lateinit var sessionManager: SessionManager
    private lateinit var audioRecordView: AudioRecordView
    private lateinit var gameManager: GameManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_recording_page)

        val retrofit = RetrofitClient.getInstance()
        tacTalkAPI = retrofit.create(TacTalkAPI::class.java)
        sessionManager = SessionManager(this)

        gameManager = GameManager(this)
        val game_id = gameManager.getGameID()
        val teamName = gameManager.getTeamName()
        val oppositionName = gameManager.getOppositionName()

        team_name.text = teamName
        opposition_team_name.text = oppositionName

        // Google Cloud Storage Bucket
        storage = Firebase.storage("gs://tactalk-bucket")

        // Points to the root reference
        val storageRef = storage.reference

        // 15 second audio upload timer
        val recordingTimer = Timer()

        // file order number
        var num = 1

        // Current timestamp
        val timestampLong = System.currentTimeMillis() / 1000
        val timestamp = timestampLong.toString()

        // Retrieve values from Intent
        val timerVal = intent.getIntExtra("timerVal", 0)
        val halfText = intent.getStringExtra("halfText")

        // test file name with hardcoded game_id, order number and timestamp
        var fileName = "/game_" + game_id + "_" + num + "_" + timestamp + "_f.wav"

        // cache path & set up recorder
        var filePath: String = externalCacheDir?.absolutePath + fileName
        var waveRecorder = WaveRecorder(filePath)
        waveRecorder.waveConfig.sampleRate = 32000

        // Match clock
        val clock: Chronometer = findViewById(R.id.match_time)
        clock.typeface = ResourcesCompat.getFont(this, R.font.orbitron_medium)
        clock.base = SystemClock.elapsedRealtime() - timerVal
        clock.start()

        val stopButton: Button = findViewById(R.id.endHalf)
        val pauseButton: Button = findViewById(R.id.pause)
        audioRecordView = findViewById(R.id.audioRecordView)

        // Wave animation
        val waveTimer = Timer()
        waveTimer.schedule(object : TimerTask() {
            override fun run() {
                waveRecorder.onAmplitudeListener = {
                    audioRecordView.update(it)
                }
            }
        }, 0, 100)


        // Stop the recorder at 15 seconds, upload the file from cache,
        // then start the recorder again
        recordingTimer.scheduleAtFixedRate(timerTask {
            Log.d("Recorder", "Recording stopped")
            waveRecorder.stopRecording()

            cloudUploader(filePath, fileName, storageRef)

            deleteExternalStorage(fileName)

            num++
            fileName = "/game_" + game_id + "_" + num + "_" + timestamp + "_f.wav"
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

            deleteExternalStorage(fileName)

            //getScore()

            if (timerVal > 1800000) {
                val statPage = "full"
                val intent = Intent(this, StatisticFragment::class.java)
                intent.putExtra("statPage", statPage)
                startActivity(intent)
                finish()
            } else {
                val statPage = "half"
                val intent = Intent(this, StatisticFragment::class.java)
                intent.putExtra("statPage", statPage)
                startActivity(intent)
                finish()
            }

        }

        var buttonState = true
        pauseButton.setOnClickListener {
            if (buttonState) {
                pauseButton.setText(R.string.Start)
                buttonState = !buttonState
                waveRecorder.stopRecording()
                Log.d("Recorder", "Recording paused")
            } else {
                pauseButton.setText(R.string.Pause)
                buttonState = !buttonState
                waveRecorder.startRecording()
                Log.d("Recorder", "Recording Started after pause")
            }
        }

        if (halfText == "first") {
            half_text.text = "1st Half"
        } else if (halfText == "second") {
            half_text.text = "2nd Half"
        }

    }

    override fun onResume() {
        super.onResume()

        // calls statistics method every 30 seconds
        val scoreTimer = Timer()
        scoreTimer.schedule(object : TimerTask() {
            override fun run() {
                getScore()
            }
        }, 0, 30000)
    }

    // function to upload audio file to the cloud
    private fun cloudUploader(filePath: String, fileName: String, storageRef: StorageReference) {

        val contextView: View = findViewById(R.id.content_view)
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
            Snackbar.make(contextView, "Audio Upload Failed!", 5000)
                .setBackgroundTint(resources.getColor(R.color.red))
                .show()
        }.addOnSuccessListener {

        }
    }

    private fun getScore() {
        // call statistics method
        getMatchStatistics()
    }

    // clear file from external storage
    private fun deleteExternalStorage(fileName: String) {
        val filePath = externalCacheDir?.absolutePath
        try {
            val file = File(filePath, fileName)
            if (file.exists()) {
                file.delete()
            }
        } catch (e: Exception) {
            Log.e("CacheDelete", "Exception while deleting file " + e.message)
        }
    }

    // get statistics call
    private fun getMatchStatistics() {

        val contextView: View = findViewById(R.id.content_view)

        // TacTalk API call
        // extract game id and auth token
        tacTalkAPI.getMatchStatistics(
            game_id = "${gameManager.getGameID()}",
            token = "${sessionManager.getAuthToken()}"
        ).enqueue(object : Callback<StatsProperty> {
            // handle failed response
            override fun onFailure(call: Call<StatsProperty>, t: Throwable) {
                Snackbar.make(contextView, t.message.toString(), 3000)
                    .setBackgroundTint(resources.getColor(R.color.green))
                    .show()
            }

            // handle response
            override fun onResponse(
                call: Call<StatsProperty>,
                response: Response<StatsProperty>
            ) {
                val statsResponse = response.body()
                val errorResponse = response.errorBody()

                if (errorResponse != null) {
                    try {
                        // display error
                        val errorMessage = JSONObject(response.errorBody()!!.string())
                        Snackbar.make(contextView, errorMessage.getString("message"), 5000)
                            .setBackgroundTint(resources.getColor(R.color.red))
                            .show()
                    } catch (e: Exception) {
                        Snackbar.make(contextView, e.message.toString(), 3000)
                            .setBackgroundTint(resources.getColor(R.color.green))
                            .show()
                    }
                } else if (statsResponse != null) {
                    try {
                        // display score
                        team_goals.text = statsResponse.result.teamGoal.toString()
                        team_points.text = statsResponse.result.teamPoints.toString()

                        opp_team_goals.text = statsResponse.result.oppTeamGoal.toString()
                        opp_team_points.text = statsResponse.result.oppTeamPoints.toString()
                    } catch (e: Exception) {
                        Snackbar.make(contextView, e.message.toString(), 3000)
                            .setBackgroundTint(resources.getColor(R.color.green))
                            .show()
                    }
                }
            }
        })
    }

    // disable back button
    override fun onBackPressed() {}
}