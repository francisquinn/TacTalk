package com.example.tactalk.user

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.tactalk.R
import com.example.tactalk.login.LoginFragment
import com.example.tactalk.main.MainMenuFragment
import com.example.tactalk.team.ManageTeamFragment
import kotlinx.android.synthetic.main.fragment_user_page.*


class UserFragment : AppCompatActivity() {

    private lateinit var userManager: UserManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_user_page)

        userManager = UserManager(this)
        val name = userManager.getUserFullName()
        val email = userManager.getUserEmail()

        // display name and email
        user_name.text = name
        user_email.text = email

        // logout redirect
        logout_button.setOnClickListener {
            val intent = Intent(this, LoginFragment::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            startActivity(intent)
            finish()
        }

        // back arrow
        back_arrow.setOnClickListener {
            finish()
        }

    }
}