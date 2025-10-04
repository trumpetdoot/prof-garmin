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

# Example usage
pdf_text = extract_text_from_pdf("./assets/textbook.pdf")
print(pdf_text[0])  # First page text
print(f"Extracted {len(pdf_text)} pages")

all_chunks = []
for page in pdf_text:
    print(f"Processing page {page['page']}...")
    page_chunks = split_to_chunks(page["text"], max_tokens=400)
    for i, chunk in enumerate(page_chunks):
        all_chunks.append({
            "id": f"page{page['page']}_chunk{i}",
            "text": chunk,
            "page": page["page"]
        })
    print(f" -> Finished page {page['page']} with {len(page_chunks)} chunks")

print(f"Total chunks: {len(all_chunks)}")
print(all_chunks[0])


model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
chunk_text = [chunk["text"] for chunk in all_chunks]
embeddings = model.encode(chunk_text)
print(f"Generated {len(embeddings)} embeddings, dimension {len(embeddings[0])}")


pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
index_name = "textbook-index"

if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=384,  # MiniLM
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index(index_name)

vectors = [
    (f"chunk{i}", embeddings[i], {"text": chunk_text[i], "page": all_chunks[i]["page"]})
    for i in range(len(all_chunks))
]

index.upsert(vectors)
print("Done Uploading to pinecone")