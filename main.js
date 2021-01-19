// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const fs = require("fs");
const os = require("os");

// Creates a client
const client = new speech.SpeechClient();

async function audioRecognition() {
  console.log("reading audio ...");
  // remote storage of the audio file
  const gcsUri = "gs://tactalk-bucket/audioFileTest.wav";

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: gcsUri,
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

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  response.results.forEach((result) => {
    //console.log(`Transcription: ${result.alternatives[0].transcript}`);
    //console.log(`confidence: ${result.alternatives[0].confidence}`);
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

      // write the text to a text file
      fs.appendFileSync("test.txt", `${wordInfo.word},${startSecs}` + os.EOL);
    });
  });
  console.log("File saved.");
  process.exit();
}
audioRecognition();
