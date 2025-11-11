import type { Diagnosis, Entry, HospitalEntry,
  OccupationalHealthcareEntry, HealthCheckEntry
 } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const checkDiagnosisCode = (code: string, diagnoses: Diagnosis[]) => {
    const diagnosis = diagnoses.find(d => d.code === code )?.name;
    return diagnosis;
  };

const HospitalEntry = ({ entry, diagnoses }: { entry: HospitalEntry, diagnoses: Diagnosis[] }) => {
  return (
    <div>
      <p>{entry.date} {entry.description}</p>
      <p>Discharge date: {entry.discharge.date}.</p>
      <p>Criteria: {entry.discharge.criteria}.</p>
      <ul>
        {entry?.diagnosisCodes?.map(c =>
          <li key={c}>{c} {checkDiagnosisCode(c, diagnoses)}</li>
        )}
      </ul>
    </div>
  );
};

const OccupationalHealthcareEntry = ({ entry, diagnoses }: { entry: OccupationalHealthcareEntry, diagnoses: Diagnosis[] }) => {
  return (
    <div>
      <p>{entry.date} {entry.description}</p>
      <p>Employer: {entry.employerName}.</p>
      <h4>Sick leave:</h4>
      <p>Start: {entry.sickLeave?.startDate || 'N/A'}</p>
      <p>End: {entry.sickLeave?.endDate || 'N/A'}</p>
      <ul>
        {entry?.diagnosisCodes?.map(c =>
          <li key={c}>{c} {checkDiagnosisCode(c, diagnoses)}</li>
        )}
      </ul>
    </div>
  );
};

const HealthCheckEntry = ({ entry, diagnoses }: { entry: HealthCheckEntry, diagnoses: Diagnosis[] }) => {
  return (
    <div>
      <p>{entry.date} {entry.description}</p>
      <p>Health risk level: {entry.healthCheckRating}</p>
      <ul>
        {entry?.diagnosisCodes?.map(c =>
          <li key={c}>{c} {checkDiagnosisCode(c, diagnoses)}</li>
        )}
      </ul>
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry, diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;