from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
import os
from dotenv import load_dotenv

load_dotenv()

# Load embedding model (MiniLM)
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Initialize Pinecone
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
index_name = "textbook-index"
index = pc.Index(index_name)

def query_textbook(transcript: str, top_k: int = 3):
    """
    Query Pinecone with a transcript and return top_k relevant textbook chunks.
    
    Args:
        transcript (str): The transcript text to search for.
        top_k (int): Number of top matches to return.

    Returns:
        List[dict]: Each dict contains 'score', 'page', and 'text'.
    """
    # 1️⃣ Embed the transcript
    query_embedding = model.encode([transcript], convert_to_numpy=True).tolist()[0]

    # 2️⃣ Query Pinecone
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )

    # 3️⃣ Format output
    matches = []
    for match in results["matches"]:
        matches.append({
            "score": match["score"],
            "page": match["metadata"]["page"],
            "text": match["metadata"]["text"]
        })
    
    return matches

# ---------- Example usage ----------
transcript_text = "What are data systems?"

top_chunks = query_textbook(transcript_text, top_k=3)

for i, chunk in enumerate(top_chunks):
    print(f"Match {i+1} | Score: {chunk['score']:.3f} | Page: {chunk['page']}")
    print(f"Text: {chunk['text']}\n")
