import { useState, SyntheticEvent } from "react";
import { Diagnosis, HealthCheckRating, newEntry } from "../../types";

interface Props {
  show: boolean;
  patientId: string;
  diagnoses: Diagnosis[];
  submitEntry: (id: string, values: newEntry) => void;
}

const HealthCheckForm = (props: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);

  if (!props.show) {
    return null;
  }
  
  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const newEntry = {
      description,
      date,
      specialist,
      diagnosisCodes,
      type: "HealthCheck",
      healthCheckRating
    };
    props.submitEntry(props.patientId, newEntry);

    setDescription('');
    setDate('');
    setSpecialist('');
    setDiagnosisCodes([]);
  };
  
  const addCode = () => {
    if (diagnosisCode.length > 0 && !diagnosisCodes.includes(diagnosisCode)) {
      setDiagnosisCodes(diagnosisCodes.concat(diagnosisCode));
    }
  };

  return (
    <>
      <h3>Health check form</h3>
      <h4>General:</h4>
      <form onSubmit={addEntry}>
        <label htmlFor="description">description</label>
        <input id="description"
          type="text"
          value={description}
          onChange={({ target }) => setDescription(target.value)} /><br />
        <label htmlFor="date">date</label>
        <input id="date"
          type="date"
          value={date}
          onChange={({ target }) => setDate(target.value)} /><br />
        <label htmlFor="specialist">specialist</label>
        <input id="specialist"
          type="text"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)} /><br />
        <label htmlFor="diagnosisCode">diagnosis code</label>
        <select id="diagnosisCode" onChange={({ target }) => setDiagnosisCode(target.value)}>
          <option value="">none</option>
          {props.diagnoses.map(d => (
            <option key={d.code} value={d.code}>{d.code}: {d.name}</option>
          ))}
        </select><br />
        <div>Diagnosis codes: {diagnosisCodes.join(', ')}</div>
        <button onClick={addCode} type="button">add diagnosis code</button><br />
        <label htmlFor="rating">health rating</label>
        <select id="rating" onChange={({ target }) => setHealthCheckRating(Number(target.value))}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default HealthCheckForm;