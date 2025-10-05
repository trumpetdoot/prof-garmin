from diffusers import StableDiffusionImg2ImgPipeline
import torch
from PIL import Image
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("HUGGINGFACE_HUB_TOKEN_IMAGE")


# Your Hugging Face API token
HF_TOKEN = api_key

# Load the pipeline with token
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5", 
    use_auth_token=HF_TOKEN,
    torch_dtype=torch.float16
)
pipe.to("cpu")  # or "cpu"

# Open your input image
init_image = Image.open("input_frame.png").convert("RGB")

# Generate AI sprite
prompt = "Cartoon-style sprite of the character"
result = pipe(prompt=prompt, image=init_image, strength=0.7, guidance_scale=7.5)

# Save the generated sprite
result.images[0].save("sprite.png")
