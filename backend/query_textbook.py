# query_textbook.py
import os
import sys
import json
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from transformers import pipeline

load_dotenv()

# ---------- Load models ----------
# Embedding model
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# ---------- Initialize Pinecone ----------
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not set in environment")

pc = Pinecone(api_key=PINECONE_API_KEY)
INDEX_NAME = "textbook-index"
index = pc.Index(INDEX_NAME)


# ---------- Core functions ----------
def query_textbook(transcript: str, top_k: int = 3):
    """Return top_k relevant textbook chunks for a transcript."""
    query_embedding = embedding_model.encode([transcript], convert_to_numpy=True).tolist()[0]

    try:
        results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    except Exception as e:
        print(json.dumps({"error": f"Pinecone query failed: {str(e)}"}))
        sys.exit(1)
        
    matches = []
    for match in results.get("matches", []):
        matches.append({
            "score": match["score"],
            "page": match["metadata"]["page"],
            "text": match["metadata"]["text"]
        })
    return matches


def summarize_transcript(transcript: str, top_k: int = 3, max_length: int = 250):
    """Query the textbook and summarize the top chunks."""
    top_chunks = query_textbook(transcript, top_k=top_k)

    if not top_chunks:
        return {"summary": "No relevant information found", "source_pages": []}

    combined_text = "\n\n".join([f"Page {chunk['page']}:\n{chunk['text']}" for chunk in top_chunks])
    source_pages = [chunk["page"] for chunk in top_chunks]

    # summary_result = summarizer(combined_text, max_length=max_length, min_length=50, do_sample=False)
    # summary = summary_result[0]["summary_text"]

    return {
        "summary": combined_text.strip(),
        "source_pages": source_pages
    }


# ---------- Command-line interface ----------
if __name__ == "__main__":
    # Read transcript JSON from stdin
    try:
        input_data = json.load(sys.stdin)
        transcript_text = input_data.get("transcript", "")
        if not transcript_text:
            raise ValueError("Transcript key not found or empty")
    except Exception as e:
        print(json.dumps({"error": f"Failed to read input: {str(e)}"}))
        sys.exit(1)

    # Generate summary
    try:
        result = summarize_transcript(transcript_text, top_k=3)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"Failed to summarize transcript: {str(e)}"}))
        sys.exit(1)
