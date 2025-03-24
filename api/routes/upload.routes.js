import { uploadController } from '../controllers/upload.controller.js';
import { authMiddleware } from '../middlewares/auth.js';
import { upload } from '../config/app.js';

const uploadRoutes = (app) => {
  // Upload a file
  app.post('/upload', authMiddleware, upload.single('file'), uploadController.uploadFile);
  
  // Upload a base64 encoded file
  app.post('/uploads', authMiddleware, uploadController.uploadBase64File);
  
  // Delete a file
  app.delete('/upload/:filename', authMiddleware, uploadController.deleteFile);
};

export default uploadRoutes;