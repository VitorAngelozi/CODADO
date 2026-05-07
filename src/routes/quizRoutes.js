const express = require('express');
const {
  getLevelsController,
  getQuestionsController,
  submitController,
  runBugHuntController
} = require('../controllers/quizController');

const router = express.Router();

router.get('/health', (_req, res) => {
  return res.status(200).json({ status: 'ok' });
});

router.get('/levels', getLevelsController);
router.get('/questions', getQuestionsController);
router.post('/submit', submitController);
router.post('/bug-hunt/run', runBugHuntController);

module.exports = router;
