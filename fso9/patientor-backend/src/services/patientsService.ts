import patientData from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { Patient, NonSensitivePatient, NewPatientEntry, newEntry, Entry } from '../types';

const patients: Patient[] = patientData;

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation
    })
  );
};

const addPatient = ( entry: NewPatientEntry ): Patient => {
  const id = uuid();
  const newPatientEntry = {
    ...entry,
    entries: [],
    id: id
  };
  patientData.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addEntry = (id: string, entry: newEntry): Entry => {
  const patient = patients.find(p => p.id === id);
  const entryId = uuid();
  const newEntry = {
    ...entry,
    id: entryId
  };
  patient?.entries.push(newEntry);
  return newEntry;
};

export default { getPatients, addPatient, findById, addEntry };