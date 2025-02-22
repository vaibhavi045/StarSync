import os
import requests
import chainlit as cl
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import HuggingFaceHub
from langchain.chains import RetrievalQA

# Load Hugging Face API Token
HF_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

# Define FAISS database path
DB_FAISS_PATH = os.path.join(os.getcwd(), "vectorstore", "db_faiss")

# ✅ Load LLM from Hugging Face API (Fixes previous issue)
def load_llm():
    return HuggingFaceHub(
        repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
        model_kwargs={"temperature": 0.5, "max_new_tokens": 512}
    )

# ✅ Setup Prompt Template
def set_custom_prompt():
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""Use the following context to answer the user's question.
        If you don't know, just say "I don't know."

        Context: {context}
        Question: {question}
        Answer:"""
    )
    return prompt

# ✅ Create QA Chain
def retrieval_qa_chain(llm, db):
    prompt = set_custom_prompt()
    return RetrievalQA.from_llm(
        llm=llm,
        retriever=db.as_retriever(search_kwargs={'k': 2}),
        return_source_documents=True
    )

# ✅ Load Vector Database & Setup Retrieval
def qa_bot():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': 'cpu'})
    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    llm = load_llm()
    return retrieval_qa_chain(llm, db)

# ✅ Final Response Function
def final_result(query):
    qa = qa_bot()
    response = qa({'query': query})
    return response

# ✅ Chainlit Chatbot
@cl.on_chat_start
async def start():
    chain = qa_bot()
    msg = cl.Message(content="Starting the bot...")
    await msg.send()
    msg.content = "Hi, Welcome to the Medical Chatbot. What is your query?"
    await msg.update()
    cl.user_session.set("chain", chain)

@cl.on_message
async def main(message: cl.Message):
    chain = cl.user_session.get("chain")
    res = await chain.acall(message.content)
    answer = res["result"]
    sources = res.get("source_documents", [])

    # ✅ Extract only the relevant answer (without raw context dump)
    final_answer = f"**Answer:** {answer}\n\n"

    # ✅ Format sources properly (show only relevant details)
    if sources:
        formatted_sources = "\n".join([
            f"- 📄 *{doc.metadata.get('source', 'Unknown Source')}* (Page {doc.metadata.get('page_label', 'N/A')})"
            for doc in sources
        ])
        final_answer += f"**Sources:**\n{formatted_sources}"
    else:
        final_answer += "**Sources:** No specific document found."

    # ✅ Send the formatted message
    await cl.Message(content=final_answer).send()
