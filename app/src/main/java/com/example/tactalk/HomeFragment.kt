package com.example.tactalk

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.Navigation
import kotlinx.android.synthetic.main.fragment_home_screen.view.*
import androidx.appcompat.app.AppCompatActivity

class HomeFragment : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.fragment_home_screen)

        val stopButton : Button = findViewById(R.id.GoMainMenu)

        stopButton.setOnClickListener{
            Toast.makeText(this, "pressed!", Toast.LENGTH_SHORT).show()
        }

    }

   /* override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_home_screen, container, false)



        view.GoMainMenu.setOnClickListener{ Navigation.findNavController(view).navigate(R.id.HomeToMain)}

        view.btn_login_page.setOnClickListener{ Navigation.findNavController(view).navigate(R.id.HomeToLogin)}

        view.btn_register_page.setOnClickListener{ Navigation.findNavController(view).navigate(R.id.HomeToReg)}


        return view
    }*/



}