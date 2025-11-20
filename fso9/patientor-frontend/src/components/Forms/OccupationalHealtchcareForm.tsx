import { SyntheticEvent, useState } from "react";
import { newEntry, Diagnosis } from "../../types";

interface Props {
  show: boolean;
  patientId: string;
  diagnoses: Diagnosis[];
  submitEntry: (id: string, values: newEntry) => void;
}

const OccupationalHealthcareForm = (props: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!props.show) {
    return null;
  }

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const newEntryBasic = {
      description,
      date,
      specialist,
      diagnosisCodes,
      type: "OccupationalHealthcare",
      employerName
    };

    if (startDate.length > 0 || endDate.length > 0) {
      const newEntryWithSickleave = {
        ...newEntryBasic,
        sickLeave: {
          startDate,
          endDate
        }
      };
      props.submitEntry(props.patientId, newEntryWithSickleave);
    } else {
      props.submitEntry(props.patientId, newEntryBasic);
    }

    setDescription('');
    setDate('');
    setSpecialist('');
    setDiagnosisCodes([]);
    setEmployerName('');
    setStartDate('');
    setEndDate('');
  };

  const addCode = () => {
    if (diagnosisCode.length > 0 && !diagnosisCodes.includes(diagnosisCode)) {
      setDiagnosisCodes(diagnosisCodes.concat(diagnosisCode));
    }
  };

  return (
    <>
      <h3>Occupational healthcare form</h3>
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
        <label htmlFor="employerName">employer name</label>
        <input id="employerName"
          type="text"
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)} /><br />
        <h4>Sick leave {'(opitonal)'}:</h4>
        <label htmlFor="startDate">start date</label>
        <input id="startDate"
          type="date"
          value={startDate}
          onChange={({ target }) => setStartDate(target.value)} /><br />
        <label htmlFor="endDate">end date</label>
        <input id="endDate"
          type="date"
          value={endDate}
          onChange={({ target }) => setEndDate(target.value)} /><br />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default OccupationalHealthcareForm;