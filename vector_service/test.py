import pickle
import faiss
import numpy as np
import umap
import matplotlib.pyplot as plt

# load index
index = faiss.read_index("store/index.faiss")

# reconstruct vectors
vectors = np.array([index.reconstruct(i) for i in range(index.ntotal)])

# load metadata
with open("store/metadata.pkl", "rb") as f:
    metadata = pickle.load(f)

# get docIds
doc_ids = [metadata[i]["docId"] for i in range(len(metadata))]

# reduce dimensions
reducer = umap.UMAP(n_neighbors=5, n_components=2)
embedding_2d = reducer.fit_transform(vectors)

# plot
plt.figure()
for i, point in enumerate(embedding_2d):
    plt.scatter(point[0], point[1])
    plt.text(point[0], point[1], doc_ids[i], fontsize=8)

plt.title("FAISS Embedding Visualization")
plt.savefig("faiss_viz.png")