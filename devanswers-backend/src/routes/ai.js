import express from 'express';
import { improveQuestionHandler, summarizeAnswersHandler } from '../controllers/aiController.js';
import authenticate from '../middleware/authHandler.js';

const router = express.Router();

router.post('/improve-question', authenticate, improveQuestionHandler);
router.post('/summarize-answers', authenticate, summarizeAnswersHandler);

export default router;
