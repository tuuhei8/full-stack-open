import express from 'express';

import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res) => {
  const diagnoses = diagnosesService.getDiagnoses();

  if (diagnoses) {
    res.send(diagnoses);
  } else {
    res.sendStatus(404);
  }
});

export default router;