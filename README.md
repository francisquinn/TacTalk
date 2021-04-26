<img src="https://user-images.githubusercontent.com/47331914/107634443-6bbb5a00-6c61-11eb-9848-96de9bc3ea0f.PNG" width=500>

# Welcome to the TacTalk T-CA4 Github repository

## Project Overview
Tactical analysis is typically collected manually during Gaelic football matches by painstakingly gathering data by viewing the recording after the match or sometimes by using pen and paper to write down in-game statistics. This process is often very time consuming and expensive due to the physical and software technologies available on the market.
**TacTalk** is a mobile and web application that is looking to solve this problem by using voice recognition technology to automatically collect and store **real-time** match statistics during a Gaelic football match. The match statistical data can then be further analyzed directly after the match, saving teams both **time** and **money**.

## Setting Up TacTalk
The Android mobile application is located on the [main](https://github.com/francisquinn/TacTalk/tree/main) branch. <br />
TacTalk is built using Kotlin in Android. In order to build and run the application it is required to use Android Studio. <br />
* [How to run an Android app in Android Studio](https://developer.android.com/training/basics/firstapp/running-app)

Alternatively, a test Android APK file can be supplied to download the TacTalk application directly on the device.  

## TacTalk Server
The TacTalk server source code is located on the [server](https://github.com/francisquinn/TacTalk/tree/server) branch. <br />
The server was developed using NodeJS and is being hosted using Heroku. <br />
<br />
To run the server locally, enter the following command in the index.js file:

```
node index.js
```

The link to the server endpoint: [https://tactalk-rojak.herokuapp.com/](https://tactalk-rojak.herokuapp.com/)
