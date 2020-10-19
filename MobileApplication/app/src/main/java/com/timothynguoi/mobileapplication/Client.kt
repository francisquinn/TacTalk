package com.timothynguoi.mobileapplication

import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.lang.Exception
import java.net.HttpURLConnection
import java.net.Socket
import java.net.URL
import java.net.URLEncoder

public class Client : Thread()
{
    public override fun run() {
        super.run()

        //Test API function with Movie Database
        val api_key = "78cf12b3a83f318f5cb6cd2939130095"
        var reqParam = URLEncoder.encode("api_key", "UTF-8") + "=" + URLEncoder.encode(api_key, "UTF-8")

        val mURL = URL("https://api.themoviedb.org/3/authentication/token/new?"+reqParam)

        with(mURL.openConnection() as HttpURLConnection) {
            // optional default is GET
            requestMethod = "GET"

            println("URL : $url")
            println("Response Code : $responseCode")

            BufferedReader(InputStreamReader(inputStream)).use{
                val response = StringBuffer()

                var inputLine = it.readLine()
                while (inputLine != null) {
                    response.append(inputLine)
                    inputLine = it.readLine()
                }
                it.close()
                println("Response : $response")
            }
        }

    }
}