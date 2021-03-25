package com.example.tactalk.user

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.tactalk.network.user.UserApi
import com.example.tactalk.network.user.UserProperty
import kotlinx.coroutines.launch

class UserViewModel : ViewModel() {

    // The internal MutableLiveData String that stores the most recent response
    private val _response = MutableLiveData<String>()

    // The external immutable LiveData for the response String
    val response: LiveData<String>
        get() = _response

    private val _property = MutableLiveData<UserProperty>()

    val property: LiveData<UserProperty>
        get() = _property

    init {
        getUserDetails()
    }

    /**
     * Sets the value of the status LiveData to the Mars API status.
     */
    private fun getUserDetails() {
        viewModelScope.launch {
            try {
                _property.value = UserApi.retrofitService.getUserProperties()
            } catch (e: Exception) {
                _response.value = "Failure: ${e.message}"
            }
        }
    }

}