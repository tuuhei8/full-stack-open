import { Patient, Diagnosis } from "../types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import patientService from "../services/patients";
import EntryDetails from "./EntryDetails";

const PatientDetails = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const id = String(useParams().id);
  const [patient, setPatient] = useState<Patient>(Object);
  const entries = patient?.entries;

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getPatientById(id);
      setPatient(patient);
    };
    void fetchPatient();
  }, [id]);

  return (
    <div>
      <div>
        <h1>{patient?.name}</h1>
        ssn: {patient?.ssn}<br />
        occupation: {patient?.occupation}
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