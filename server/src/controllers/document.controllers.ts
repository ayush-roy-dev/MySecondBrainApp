import { RequestHandler } from "express";
import Doc from "../models/Document";
import { PdfService } from "../services/pdf.service";
import { chunkText } from "../services/chunk.service";
import Chunk from "../models/Chunk";
import axios from "axios";
import fs from "fs/promises";
import path from "path";



export const getAllDocuments: RequestHandler = async (req, res) => {

    const docs = await Doc.find().select("-filePath").sort({ uploadedAt: -1 });
    res.status(200).json({
        documents: docs,
    });
}


export const createDocument: RequestHandler = async (req, res) => {
    try {
        const file = req.file;
        const { title, type } = req.body;

        if (!file) return res.status(400).json({ message: "File is required" });
        if (!title || !type || (type != "txt" && type != "pdf")) return res.status(400).json({ message: "Title and type are required" });

        // create db entry with filepath
        const doc = await Doc.create({
        title: title, 
        filePath: file.path.split(path.sep)[-1], 
        type,
        });
        
        let text = "";
        if (file.mimetype === "application/pdf") {
            text = await PdfService.extractText(file.path);
        }

        if (file.mimetype === "text/plain") {
            text = await fs.readFile(file.path, "utf-8");
        }

        const chunks = chunkText(text, 100, 15); // chunk size of 100 characters
        const docs = chunks.map((chunk) => ({
            docId: doc._id,
            text: chunk,
        }));

        const insertedChunks = await Chunk.insertMany(docs);

        const items = insertedChunks.map((chunkDoc, i) => ({
            chunkId: chunkDoc._id.toString(),
            docId: doc._id.toString(),
            chunk: chunks[i],
        }));
        

        const vectors = await axios.post("http://localhost:8000/add-batch", {
            items: items,
        })
        if (!vectors) return res.status(500).json({ message: "Error vector service" });   
    

        res.status(201).json({
        message: "Paper uploaded successfully",
        docId: doc._id, 
        });




    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getDocument: RequestHandler = async (req, res) => {
    const { docId } = req.params;
    const doc = await Doc.findById(docId)
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const filePath = path.join(__dirname, "../../uploads", doc.filePath.split(path.sep).pop() || "");

    res.status(200).json({doc}).sendFile(filePath);
}

export const updateDocument: RequestHandler = async (req, res, next) => {
  try {
    const { docId } = req.params;
    const { title, type } = req.body;
    const file = req.file;

    const doc = await Doc.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // update metadata
    if (title) doc.title = title;
    if (type) doc.type = type;

    let text = "";

    if (file) {
      // delete old file
      if (doc.filePath) {
        const oldPath = path.join("uploads", doc.filePath);
        await fs.unlink(oldPath).catch(() => {});
      }

      doc.filePath = file.filename;

      // extract text
      if (file.mimetype === "application/pdf") {
        text = await PdfService.extractText(file.path);
      } else if (file.mimetype === "text/plain") {
        text = await fs.readFile(file.path, "utf-8");
      }

      // delete old chunks
      await Chunk.deleteMany({ docId: doc._id });

      // delete vectors from FAISS 
      await axios.post("http://localhost:8000/delete-doc", {
        docId: doc._id.toString(),
      });

      // create new chunks
      const chunks = chunkText(text, 100, 15);

      const docs = chunks.map((chunk) => ({
        docId: doc._id,
        text: chunk,
      }));

      const insertedChunks = await Chunk.insertMany(docs);

      const items = insertedChunks.map((chunkDoc, i) => ({
        chunkId: chunkDoc._id.toString(),
        docId: doc._id.toString(),
        chunk: chunks[i],
      }));

      // re-add vectors
      await axios.post("http://localhost:8000/add-batch", {
        items,
      });
    }

    await doc.save();

    return res.json({
      message: "Document updated successfully",
      docId: doc._id,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDocument: RequestHandler = async (req, res, next) => {
  try {
    const { docId } = req.params;

    const doc = await Doc.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // delete file
    if (doc.filePath) {
      const filePath = path.join("uploads", doc.filePath);
      await fs.unlink(filePath).catch(() => {});
    }

    // delete chunks
    await Chunk.deleteMany({ docId: doc._id });

    // delete vectors from FAISS
    await axios.post("http://localhost:8000/delete-doc", {
      docId: doc._id.toString(),
    });

    // delete document
    await Doc.findByIdAndDelete(docId);

    return res.json({
      message: "Document deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

