package com.example.tactalk

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.fragment_main_menu.view.*
import kotlinx.android.synthetic.main.fragment_set_up_match.view.*
import kotlinx.android.synthetic.main.fragment_stats.view.*

class StatsFragment : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_stats)
    }

    override fun onBackPressed() {}

}