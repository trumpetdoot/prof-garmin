import os
import nltk
nltk.download("punkt_tab")

from dotenv import load_dotenv
from nltk.tokenize import sent_tokenize
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = []
    for i, page in enumerate(reader.pages):
        page_text = page.extract_text()
        if page_text:
            text.append({"page": i+1, "text": page_text})
    return text

def split_to_chunks(text, max_tokens=500):
    sentences = sent_tokenize(text)
    chunks, current_chunk = [], []
    current_length = 0

    for sentence in sentences:
        tokens = sentence.split()
        if current_length + len(tokens) > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_length = 0
        current_chunk.extend(tokens)
        current_length += len(tokens)

    if current_chunk:  # last one
        chunks.append(" ".join(current_chunk))
    return chunks

def process_pdf(pdf_path="../assets/textbookf.pdf"):
    print("📘 Extracting text...")
    pdf_text = extract_text_from_pdf(pdf_path)
    print(f"Extracted {len(pdf_text)} pages")

    all_chunks = []
    for page in pdf_text:
        page_chunks = split_to_chunks(page["text"], max_tokens=400)
        for i, chunk in enumerate(page_chunks):
            all_chunks.append({
                "id": f"page{page['page']}_chunk{i}",
                "text": chunk,
                "page": page["page"]
            })
    print(f"Total chunks: {len(all_chunks)}")

    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    chunk_text = [chunk["text"] for chunk in all_chunks]
    embeddings = model.encode(chunk_text)

    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
    index_name = "textbook-index"

    if not pc.has_index(index_name):
        pc.create_index(
            name=index_name,
            dimension=384,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )

    index = pc.Index(index_name)
    vectors = [(f"chunk{i}", embeddings[i], {"text": chunk_text[i], "page": all_chunks[i]["page"]})
               for i in range(len(all_chunks))]

    index.upsert(vectors)
    print("✅ Done uploading to Pinecone")

if __name__ == "__main__":
    process_pdf()