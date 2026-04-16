import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },  
    type: {
        type: String,
        required: true,
        enum: ['pdf', 'txt']
    },
    filePath: { type: String, required: true },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const Doc = mongoose.model('Doc', docSchema);

export default Doc;