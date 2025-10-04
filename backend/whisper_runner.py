import sys
import json
from whisper import load_model  # or whatever Whisper wrapper you use
from query_textbook import summarize_transcript

AUDIO_FILE = sys.argv[1]  # path passed from Node

# 1️⃣ Load Whisper model
model = load_model("base", device="cpu")

# 2️⃣ Transcribe
result = model.transcribe(AUDIO_FILE)
transcript = result["text"]

# 3️⃣ Summarize textbook info
summary_data = summarize_transcript(transcript, top_k=3)

# 4️⃣ Print JSON only
print(json.dumps({
    "summary": summary_data["summary"],
    "source_pages": summary_data["source_pages"]
}))
