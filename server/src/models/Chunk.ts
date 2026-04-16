import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doc' },
    text: String,
});

const Chunk = mongoose.model('Chunk', chunkSchema);

export default Chunk;