// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const fs = require("fs").promises;

// Creates a client
const client = new speech.SpeechClient();

async function quickstart() {
  // The name of the audio file to transcribe
  const fileName = "audioFileTest.wav";
  console.log(`file: ${fileName}`);

  console.log("reading audio ...");
  // Reads a local audio file and converts it to base64
  const file = await fs.readFile(fileName);
  const audioBytes = file.toString("base64");

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    enableWordTimeOffsets: true,
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-GB",
  };
  const request = {
    audio: audio,
    config: config,
  };
  
  // String of converted audio
  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  console.log('detecting...');
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
  

  /*

  // Timestamp of each word

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  response.results.forEach((result) => {
    console.log(`Transcription: ${result.alternatives[0].transcript}`);
    result.alternatives[0].words.forEach((wordInfo) => {
      // NOTE: If you have a time offset exceeding 2^32 seconds, use the
      // wordInfo.{x}Time.seconds.high to calculate seconds.
      const startSecs =
        `${wordInfo.startTime.seconds}` +
        "." +
        wordInfo.startTime.nanos / 100000000;
      const endSecs =
        `${wordInfo.endTime.seconds}` +
        "." +
        wordInfo.endTime.nanos / 100000000;
      console.log(`Word: ${wordInfo.word}`);
      console.log(`\t ${startSecs} secs - ${endSecs} secs`);
    });
  });
  */
}
quickstart();
