# python script that generates the transcript from the 30s clip

import sys
import whisper
import json

if len(sys.argv) < 2:
    print("Usage: python transcribe.py <audio_path>")
    sys.exit(1)

audio_path = sys.argv[1]

model = whisper.load_model("base")
result = model.transcribe(audio_path)

print(json.dumps({"text": result["text"]}))