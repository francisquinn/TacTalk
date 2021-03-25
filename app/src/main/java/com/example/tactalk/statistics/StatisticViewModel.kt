package com.example.tactalk.statistics

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.tactalk.network.statistics.StatsApi
import com.example.tactalk.network.statistics.StatsProperty
import kotlinx.coroutines.launch

class StatisticViewModel : ViewModel() {

    // The internal MutableLiveData String that stores the most recent response
    private val _response = MutableLiveData<String>()

    // The external immutable LiveData for the response String
    val response: LiveData<String>
        get() = _response

    private val _property = MutableLiveData<StatsProperty>()

    val property: LiveData<StatsProperty>
        get() = _property

    init {
        getStatisticProperties()
    }

    private fun getStatisticProperties() {
        viewModelScope.launch {
            try {
                _property.value = StatsApi.retrofitService.getStatProperties()

            } catch (e: Exception) {
                _response.value = "Failure: ${e.message}"
            }
        }
    }

}