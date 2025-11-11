import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

import diagnoses from './routes/diagnosesRouter';
import patients from './routes/patientsRouter';

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnoses);

app.use('/api/patients', patients);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});