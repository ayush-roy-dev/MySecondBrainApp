from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
import pickle

app = FastAPI()

# ---- CONFIG ----
DIMENSION = 384
INDEX_PATH = "store/index.faiss"
META_PATH = "store/metadata.pkl"
DOC_INDEX_PATH = "store/doc_index.pkl"

# ---- MODEL ----
model = SentenceTransformer("all-MiniLM-L6-v2")

# ---- LOAD INDEX ----
if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
else:
    index = faiss.IndexFlatL2(DIMENSION)

# ---- LOAD METADATA ----
if os.path.exists(META_PATH):
    with open(META_PATH, "rb") as f:
        metadata_store = pickle.load(f)
else:
    metadata_store = {}

# ---- LOAD DOC INDEX ----
if os.path.exists(DOC_INDEX_PATH):
    with open(DOC_INDEX_PATH, "rb") as f:
        doc_index = pickle.load(f)
else:
    doc_index = {}

# ---- REQUESTS ----
class AddRequest(BaseModel):
    chunkId: str
    docId: str
    chunk: str

class BatchAddRequest(BaseModel):
    items: list[AddRequest]

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    docId: str | None = None

class DeleteDocRequest(BaseModel):
    docId: str


# ---- SAVE ----
def save():
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "wb") as f:
        pickle.dump(metadata_store, f)
    with open(DOC_INDEX_PATH, "wb") as f:
        pickle.dump(doc_index, f)

# ---- ADD ----
@app.post("/add")
def add(req: AddRequest):
    embedding = model.encode([req.chunk])

    index.add(np.array(embedding).astype("float32"))

    # FAISS internal ID
    vector_id = index.ntotal - 1

    # Store mapping
    metadata_store[vector_id] = {
        "chunkId": req.chunkId,
        "docId": req.docId
    }

    # Update doc index
    if req.docId not in doc_index:
        doc_index[req.docId] = set()

    doc_index[req.docId].add(vector_id)

    save()

    return {
        "status": "added",
        "chunkId": req.chunkId
    }
    
    
# ---- ADD (BATCH) ----
@app.post("/add-batch")
def add_batch(req: BatchAddRequest):
    texts = [item.chunk for item in req.items]

    embeddings = model.encode(texts)

    start_id = index.ntotal

    index.add(np.array(embeddings).astype("float32"))

    for i, item in enumerate(req.items):
        vector_id = start_id + i

        # ✅ Store mapping (ONLY needed mapping)
        metadata_store[vector_id] = {
            "chunkId": item.chunkId,
            "docId": item.docId
        }

        # ✅ Doc-level grouping (for filtering)
        if item.docId not in doc_index:
            doc_index[item.docId] = set()

        doc_index[item.docId].add(vector_id)

    save()

    return {
        "status": "batch added",
        "count": len(req.items)
    }

# ---- SEARCH ----
@app.post("/search")
def search(req: SearchRequest):
    if index.ntotal == 0:
        return {"results": []}

    query_embedding = model.encode([req.query])

    D, I = index.search(
        np.array(query_embedding).astype("float32"),
        req.top_k * 5
    )

    results = []

    for idx in I[0]:
        if idx not in metadata_store:
            continue

        item = metadata_store[idx]

        # 🔥 FAST FILTER using doc_index
        if req.docId:
            if idx not in doc_index.get(req.docId, set()):
                continue

        results.append({
            "chunkId": item["chunkId"],
            "docId": item["docId"]
        })

        if len(results) >= req.top_k:
            break

    return {"results": results}


# ---- DELETE DOCUMENT ----
@app.post("/delete-doc")
def delete_doc(req: DeleteDocRequest):
    if req.docId not in doc_index:
        return {"status": "doc not found"}

    # mark vectors as deleted
    for vid in doc_index[req.docId]:
        metadata_store.pop(vid, None)

    doc_index.pop(req.docId)

    save()

    return {"status": f"deleted doc {req.docId}"}