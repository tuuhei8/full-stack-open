import express from 'express';
const app = express();
import { bmiCalculator } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (_req, res) => {
  const height = _req.query.height;
  const weight = _req.query.weight;
  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }
  const bmi = bmiCalculator(Number(height), Number(weight));
  return res.json({
    weight: weight,
    height: height,
    bmi: bmi
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    return res.status(400).send({ error: 'parameters missing' });
  }
  if (!Array.isArray(daily_exercises) || !daily_exercises.every((e) => {
    return !isNaN(Number(e));
  }) || isNaN(Number(target))) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  const result = exerciseCalculator(daily_exercises as number[], Number(target));
  return res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});