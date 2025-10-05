import sys
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("HUGGINGFACE_HUB_TOKEN")

# -----------------------------
# CONFIG: Set your HF token here if not using huggingface-cli login
# -----------------------------
HF_TOKEN = api_key  # Replace with your token
MODEL_NAME = "gpt2"  # You can also try "gpt2-medium" for longer output

# -----------------------------
# Load model and tokenizer
# -----------------------------
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_auth_token=HF_TOKEN)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, use_auth_token=HF_TOKEN)
model.eval()
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# -----------------------------
# Generate lecture continuation
# -----------------------------
def generate_lecture_script(transcript, textbook_refs=None, max_length=1500):
    textbook_refs = textbook_refs or []

    # Construct the prompt with clear instruction
    prompt = f"""
You are a university lecturer. Continue the lecture below in an educational, structured, and coherent manner. 
Use clear explanations and include examples if appropriate.

Transcript so far:
"{transcript}"

"""
    if textbook_refs:
        prompt += f"Include references from these textbooks: {', '.join(textbook_refs)}\n"

    prompt += "Continue the lecture in a natural and detailed way:\n"

    # Encode and generate
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_length,    # generate more content
            temperature=0.7,             # controls creativity
            top_p=0.95,                  # nucleus sampling
            do_sample=True,              # enable sampling
            repetition_penalty=1.2,      # reduce repetition
            pad_token_id=tokenizer.eos_token_id
        )

    # Decode output and remove the prompt part
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    continuation = generated_text[len(prompt):].strip()
    return continuation

# -----------------------------
# CLI support for Node.js child_process
# -----------------------------
if __name__ == "__main__":
    transcript = json.loads(sys.argv[1])
    textbook_refs = json.loads(sys.argv[2])
    print(generate_lecture_script(transcript, textbook_refs))
