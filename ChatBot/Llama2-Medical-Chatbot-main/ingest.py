from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
import os
from dotenv import load_dotenv
from huggingface_hub import login

# Load environment variables from .env file
load_dotenv()

# Retrieve Hugging Face token
hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

if hf_token:
    try:
        login(hf_token)
        print("✅ Hugging Face login successful!")
    except Exception as e:
        print(f"❌ Error logging into Hugging Face: {e}")
else:
    raise ValueError("⚠️ Error: Hugging Face token not found. Please set HUGGINGFACEHUB_API_TOKEN in your .env file.")

# Define paths
DATA_PATH = "data/"
DB_FAISS_PATH = "vectorstore/db_faiss"

# Create vector database
def create_vector_db():
    """Loads PDFs, splits text, generates embeddings, and stores them in a FAISS vector database."""
    print("📂 Loading PDF documents...")
    loader = DirectoryLoader(DATA_PATH, glob="*.pdf", use_multithreading=True)
    documents = loader.load()
    print(f"✅ Loaded {len(documents)} documents.")

    print("✂️ Splitting documents into smaller chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    print(f"✅ Split into {len(texts)} text chunks.")

    print("🧠 Generating embeddings...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2",
                                       model_kwargs={"device": "cpu"})

    if os.path.exists(DB_FAISS_PATH):
        print("📥 Loading existing FAISS database...")
        db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    else:
        print("🆕 Creating new FAISS database...")
        db = FAISS.from_documents(texts, embeddings)
        db.save_local(DB_FAISS_PATH)

    print("✅ Vector database created successfully!")

if __name__ == "__main__":
    create_vector_db()
