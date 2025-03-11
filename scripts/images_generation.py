# Note: DALL-E 3 requires version 1.0.0 of the openai-python library or later
import os
import requests
from openai import AzureOpenAI
import json
import yaml
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

client = AzureOpenAI(
    api_version="2024-02-01",
    azure_endpoint="https://admin-m42lzl1w-swedencentral.cognitiveservices.azure.com/",
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
)

def ensure_output_dir(path):
    """Ensure the output directory exists for the given path"""
    output_dir = os.path.join(os.path.dirname(__file__), 'output_images', os.path.dirname(path))
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    return output_dir

def download_image(url, output_path):
    """Download an image from a URL and save it to the specified path"""
    response = requests.get(url)
    response.raise_for_status()
    
    with open(output_path, 'wb') as f:
        f.write(response.content)

def generate_image(prompt, output_name, path):
    """Generate an image using DALL-E 3 and save it to the output folder"""
    result = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1
    )
    
    image_url = json.loads(result.model_dump_json())['data'][0]['url']
    
    # Setup output path using the path from YAML
    output_dir = ensure_output_dir(path)
    output_path = os.path.join(output_dir, os.path.basename(path))
    
    # Download and save the image
    download_image(image_url, output_path)

    print(f"Generated and saved image for {output_name} to {output_path}")

def main():
    # Read the YAML file
    script_dir = os.path.dirname(__file__)
    yaml_path = os.path.join(script_dir, 'image_prompts.yaml')
    
    with open(yaml_path, 'r') as file:
        data = yaml.safe_load(file)
    
    # Process each image prompt
    for image in data['images']:
        try:
            generate_image(image['prompt'], image['name'], image['path'])
        except Exception as e:
            print(f"Error generating image {image['name']}: {str(e)}")

if __name__ == "__main__":
    main()