import { SyntheticEvent, useState } from "react";
import { newEntry, Diagnosis } from "../../types";

interface Props {
  show: boolean;
  patientId: string;
  diagnoses: Diagnosis[];
  submitEntry: (id: string, values: newEntry) => void;
}

const HospitalForm = (props: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [criteria, setCriteria] = useState('');

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
      type: "Hospital",
      discharge: {
        date: dischargeDate,
        criteria
      }
    };
    props.submitEntry(props.patientId, newEntry);
    
    setDescription('');
    setDate('');
    setSpecialist('');
    setDiagnosisCodes([]);
    setDischargeDate('');
    setCriteria('');
  };

  const addCode = () => {
    if (diagnosisCode.length > 0 && !diagnosisCodes.includes(diagnosisCode)) {
      setDiagnosisCodes(diagnosisCodes.concat(diagnosisCode));
    }
  };

  return (
    <>
      <h3>Hospital form</h3>
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
        <div>Diagnosis codes: {diagnosisCodes.join(' ')}</div>
        <button onClick={addCode} type="button">add diagnosis code</button><br />
        <h4>Discharge:</h4>
        <label htmlFor="dischargeDate">discharge date</label>
        <input id="dischargeDate"
          type="date"
          value={dischargeDate}
          onChange={({ target }) => setDischargeDate(target.value)} /><br />
        <label htmlFor="criteria">criteria</label>
        <input id="criteria"
          type="text"
          value={criteria}
          onChange={({ target }) => setCriteria(target.value)} /><br />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default HospitalForm;