from pydub import AudioSegment
from pydub.utils import make_chunks

myaudio = AudioSegment.from_file("audiomass-output.wav" , "wav") 
chunk_length_ms = 10 * 1000 
chunks = make_chunks(myaudio, chunk_length_ms) #Make chunks of 10 sec

#Export all of the individual chunks as wav files

for i, chunk in enumerate(chunks):
    chunk_name = "chunk{0}.wav".format(i)
    print ("exporting"), chunk_name
    chunk.export(chunk_name, format="wav")