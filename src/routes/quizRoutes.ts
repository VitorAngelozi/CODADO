import { Router, type Request, type Response } from 'express';
import {
  getLevelsController,
  getQuestionsController,
  submitController,
  runBugHuntController,
} from '../controllers/quizController';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

router.get('/levels', getLevelsController);
router.get('/questions', getQuestionsController);
router.post('/submit', submitController);
router.post('/bug-hunt/run', runBugHuntController);

export default router;
