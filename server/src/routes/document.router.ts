import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { createDocument, deleteDocument, getAllDocuments, getDocument, updateDocument } from '../controllers/document.controllers';

const docRouter = Router();

docRouter.route('/documents').get(getAllDocuments).post(upload.single("file"),createDocument);
docRouter.route('/documents/:docId').get(getDocument).put(updateDocument).delete(deleteDocument);

export default docRouter;

