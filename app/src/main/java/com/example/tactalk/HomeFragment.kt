package com.example.tactalk

import android.content.Intent
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

        val test : Button = findViewById(R.id.GoMainMenu)
        val loginButton : Button = findViewById(R.id.btn_login_page)

        test.setOnClickListener {
            Toast.makeText(this, "pressed!", Toast.LENGTH_SHORT).show()
        }

        loginButton.setOnClickListener {
            startActivity(Intent(this, MainMenuFragment::class.java))
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