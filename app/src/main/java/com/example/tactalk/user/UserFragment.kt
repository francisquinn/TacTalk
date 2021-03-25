package com.example.tactalk.user

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.example.tactalk.R
import com.example.tactalk.databinding.FragmentUserPageBinding

class UserFragment : AppCompatActivity()  {

    private val userViewModel: UserViewModel by lazy {
        ViewModelProvider(this).get(UserViewModel::class.java)
    }

    private lateinit var binding: FragmentUserPageBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = DataBindingUtil.setContentView(this, R.layout.fragment_user_page)

        binding.lifecycleOwner = this

        binding.userViewModel = userViewModel

    }
}