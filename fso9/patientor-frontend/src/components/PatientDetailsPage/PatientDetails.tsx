import { Patient, Diagnosis, Entry, newEntry } from "../../types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import HospitalForm from "../Forms/HospitalForm";
import OccupationalHealthcareForm from "../Forms/OccupationalHealtchcareForm";
import HealthCheckForm from "../Forms/HealthCheckForm";

const PatientDetails = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const id = String(useParams().id);
  const [patient, setPatient] = useState<Patient>(Object);
  const [form, setForm] = useState('hide');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState('');
  const formStyle = {
    border: '2px solid rgba(1, 1, 1, 1)',
    padding: '10px'
  };
  const errorStyle = {
    color: 'red'
  };

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getPatientById(id);
      setPatient(patient);
      setEntries(patient.entries);
    };
    void fetchPatient();
  }, [id, patient]);

  const submitNewEntry = async (id: string, values: newEntry) => {
    try {
      await patientService.createEntry(id, values);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
          setTimeout(() => {
            setError('');
          }, 5000);
        } else if (e.response?.data.error[0].message && typeof e.response?.data.error[0].message === 'string') {
          console.error('Error: ', e.response?.data.error[0].message);
          setError(e.response?.data.error[0].message);
          setTimeout(() => {
            setError('');
          }, 5000);
        } else {
          setError("Unrecognized axios error");
          setTimeout(() => {
            setError('');
          }, 5000);
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    }
  };

  return (
    <div>
      <div>
        <h1>{patient?.name}</h1>
        ssn: {patient?.ssn}<br />
        occupation: {patient?.occupation}
      </div>
      <div>
        <button onClick={() => setForm('hospital')}>Hospital</button>
        <button onClick={() => setForm('occupational')}>Occupational Healthcare</button>
        <button onClick={() => setForm('health')}>HealthCheck</button>
        <button onClick={() => setForm('hide')}>hide</button>
      </div>
      <div style={formStyle}>
        <h3 style={errorStyle}>{error}</h3>
        <HospitalForm show={form === 'hospital'} patientId={id} submitEntry={submitNewEntry} diagnoses={diagnoses} />
        <OccupationalHealthcareForm show={form === 'occupational'} patientId={id} submitEntry={submitNewEntry} diagnoses={diagnoses} />
        <HealthCheckForm show={form === 'health'} patientId={id} submitEntry={submitNewEntry} diagnoses={diagnoses} />
      </div>
      <div>
        <h2>entries</h2>
        {entries?.map(entry =>
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        )}
      </div>
    </div>
  );
};

export default PatientDetails;