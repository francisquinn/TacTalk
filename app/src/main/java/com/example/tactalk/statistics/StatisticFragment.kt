package com.example.tactalk.statistics

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isInvisible
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.example.tactalk.EndGameFragment
import com.example.tactalk.R
import com.example.tactalk.databinding.FragmentStatisticsBinding
import com.example.tactalk.recording.RecordingPageFragment
import kotlinx.android.synthetic.main.fragment_statistics.*

class StatisticFragment : AppCompatActivity() {

    private val statsViewModel: StatisticViewModel by lazy {
        ViewModelProvider(this).get(StatisticViewModel::class.java)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val binding: FragmentStatisticsBinding = DataBindingUtil.setContentView(this, R.layout.fragment_statistics)
        binding.lifecycleOwner = this
        binding.statsViewModel = statsViewModel

        val secondHalf : Button = findViewById(R.id.second_half)
        val endGame : Button = findViewById(R.id.end_game)

        val statPage = intent.getStringExtra("statPage")

        if (statPage != null) {

            if (statPage == "half"){
                secondHalf.visibility = View.VISIBLE
                endGame.visibility = View.GONE

                secondHalf.setOnClickListener {
                    Toast.makeText(this, "Pressed", Toast.LENGTH_SHORT).show()
                    val timerVal = 2100000
                    val intent = Intent(this, RecordingPageFragment::class.java)
                    intent.putExtra("timerVal", timerVal)
                    startActivity(intent)
                    finish()
                }

            } else if (statPage == "full") {
                secondHalf.visibility = View.GONE
                endGame.visibility = View.VISIBLE

                endGame.setOnClickListener {
                    startActivity(Intent(this, EndGameFragment::class.java))
                }

            }
        }

        //Tables that hold the stats
        tablePos.isInvisible=false

        tableKickout.isInvisible=true

        tablePlayers.isInvisible=true
        //Text views
        KickoutsB.isInvisible=false
        PoessesionB.isInvisible=true
        textView12.isInvisible=true


        radioButton.setOnClickListener{
            if(radioButton.isChecked){
                // to make the tables invisible
                tablePos.isInvisible=false
                tableKickout.isInvisible=true
                tablePlayers.isInvisible=true

                //For the text view titles
                KickoutsB.isInvisible=false
                PoessesionB.isInvisible=true
                textView12.isInvisible=true
            }
            else if(radioButton2.isChecked){
                tablePos.isInvisible=true
                tableKickout.isInvisible=false
                tablePlayers.isInvisible=true


                //For the text view titles
                KickoutsB.isInvisible=true
                PoessesionB.isInvisible=false
                textView12.isInvisible=true
            }
            else if(radioButton3.isChecked){
                tablePos.isInvisible=true
                tableKickout.isInvisible=true
                tablePlayers.isInvisible=false


                //For the text view titles
                KickoutsB.isInvisible=true
                PoessesionB.isInvisible=true
                textView12.isInvisible=false
            }
        }

        radioButton2.setOnClickListener(){
            if(radioButton.isChecked){
                tablePos.isInvisible=false
                tableKickout.isInvisible=true
                tablePlayers.isInvisible=true

                //For the text view titles
                KickoutsB.isInvisible=false
                PoessesionB.isInvisible=true
                textView12.isInvisible=true
            }
            else if(radioButton2.isChecked){
                tablePos.isInvisible=true
                tableKickout.isInvisible=false
                tablePlayers.isInvisible=true

                //For the text view titles
                KickoutsB.isInvisible=true
                PoessesionB.isInvisible=false
                textView12.isInvisible=true
            }
            else if(radioButton3.isChecked){
                tablePos.isInvisible=true
                tableKickout.isInvisible=true
                tablePlayers.isInvisible=false

                //For the text view titles
                KickoutsB.isInvisible=true
                PoessesionB.isInvisible=true
                textView12.isInvisible=false

            }
        }
        radioButton3.setOnClickListener(){
            if(radioButton.isChecked){
                tablePos.isInvisible=false
                tableKickout.isInvisible=true
                tablePlayers.isInvisible=true

                //For the text view titles
                KickoutsB.isInvisible=false
                PoessesionB.isInvisible=true
                textView12.isInvisible=true
            }
            else if(radioButton2.isChecked){
                tablePos.isInvisible=true
                tableKickout.isInvisible=false
                tablePlayers.isInvisible=true

                //For the text view titles
                KickoutsB.isInvisible=true
                PoessesionB.isInvisible=false
                textView12.isInvisible=true
            }

            else if(radioButton3.isChecked){
                tablePos.isInvisible=true
                tableKickout.isInvisible=true
                tablePlayers.isInvisible=false

                //For the text view titles
                KickoutsB.isInvisible=true
                PoessesionB.isInvisible=true
                textView12.isInvisible=false
            }
        }

    }

    override fun onBackPressed() {}
}