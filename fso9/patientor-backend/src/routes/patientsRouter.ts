import express from 'express';
import { z } from 'zod';

import patientsService from '../services/patientsService';
import utils from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientsService.getPatients();

  if (patients) {
    res.send(patients);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = utils.toNewPatientEntry(req.body);
    const addedPatient = patientsService.addPatient(newPatientEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
   if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = utils.toNewEntry(req.body);
    const addedEntry = patientsService.addEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else if (error instanceof Error) {
      let errorMessage = 'Something went wrong.';
      errorMessage += ' Error: ' + error.message;
      res.status(400).send(errorMessage);
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

export default router;