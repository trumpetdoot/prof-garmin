import sys
import whisper

# Get audio file path from command-line argument
if len(sys.argv) < 2:
    print("No audio file provided", file=sys.stderr)
    sys.exit(1)

audio_file = sys.argv[1]

# Load Whisper model (choose base for speed, or small)
model = whisper.load_model("base")
result = model.transcribe(audio_file)

# Print transcript to stdout so Node can read it
print(result["text"])
