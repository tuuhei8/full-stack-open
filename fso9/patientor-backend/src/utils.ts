import { NewPatientEntry, Gender, newEntry, Diagnosis, Discharge, HealthCheckRating, SickLeave } from './types';
import { z } from 'zod';

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  return newPatientEntrySchema.parse(object);
  /*
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object &&
    'gender' in object && 'occupation' in object) {
      const newEntry: NewPatientEntry = {
        name: z.string().parse(object.name),
        dateOfBirth: z.iso.date().parse(object.dateOfBirth),
        ssn: z.string().parse(object.ssn),
        gender: z.enum(Gender).parse(object.gender),
        occupation: z.string().parse(object.occupation)
      };

    return newEntry;
  }
  
  throw new Error('Incorrect data: some fields are missing');
  */
};

export const newPatientEntrySchema = z.object({
  name: z.string().min(1, { message: 'Name required' }),
  dateOfBirth: z.iso.date(),
  ssn: z.string().min(1, { message: 'Ssn required' }),
  gender: z.enum(Gender, { message: 'Invalid gender' }),
  occupation: z.string().min(1, { message: 'Occupation required' })
});

/*
const parseProperty = (property: unknown): string => {
  if (!isString(property) || !property) {
    throw new Error('Incorrect or missing property');
  }

  return property;
};
*/
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};
/*
const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
      throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};
*/

const toNewEntry = (object: unknown): newEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('description' in object && 'date' in object && 'specialist' in object
     && 'type' in object && 'discharge' in object && object.type === 'Hospital') {
      const entry: newEntry = {
        description: z.string().min(1, { message: 'Description required' }).parse(object.description),
        date: z.iso.date().parse(object.date),
        specialist: z.string().min(1, { message: 'Specialist required' }).parse(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object),
        type: "Hospital",
        discharge: parseDischarge(object.discharge)
      };
      return entry;
    }

  if ('description' in object && 'date' in object && 'specialist' in object
     && 'type' in object && 'employerName' in object && object.type === 'OccupationalHealthcare') {
      const entry: newEntry = {
        description: z.string().min(1, { message: 'Description required' }).parse(object.description),
        date: z.iso.date().parse(object.date),
        specialist: z.string().min(1, { message: 'Specialist required' }).parse(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object),
        type: "OccupationalHealthcare",
        employerName: z.string().min(1, { message: 'Employer name required'}).parse(object.employerName),
        sickLeave: parseSickLeave(object)
      };
      return entry;
    }

  if ('description' in object && 'date' in object && 'specialist' in object
     && 'type' in object && 'healthCheckRating' in object && object.type === 'HealthCheck') {
      const entry: newEntry = {
        description: z.string().min(1, { message: 'Description required' }).parse(object.description),
        date: z.iso.date().parse(object.date),
        specialist: z.string().min(1, { message: 'Specialist required' }).parse(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object),
        type: "HealthCheck",
        healthCheckRating: z.enum(HealthCheckRating,
          { message: `Invalid health check rating ${object.healthCheckRating}` }).parse(object.healthCheckRating)
      };
      return entry;
    }

  throw new Error('Incorrect data: some fields are missing or malformed');
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseSickLeave = (object: unknown): SickLeave | undefined => {
  if (!object || typeof object !== 'object' || !('sickLeave' in object)) {
    console.log('no sickleave parameter received in new occupational healthcare entry');
    return;
  }

  if ('sickLeave' in object && typeof object.sickLeave === 'object') {
    if (isSickLeave(object.sickLeave as object)) {
      return object.sickLeave as SickLeave;
    }
  }

  throw new Error('Sickleave dates missing or wrong');
};

const isSickLeave = (object: object): object is SickLeave => {
  if (!('startDate' in object) || !('endDate' in object) || Object.values(object).length !== 2 ||
    !z.iso.date({ message: 'Sick leave start date missing or wrong' }).parse(object.startDate) ||
    !z.iso.date({ message: 'Sick leave end date missing or wrong' }).parse(object.endDate)) {
    return false;
  }
  return true;
};

const parseDischarge = (object: unknown): Discharge => {
  if (!object || typeof object !== 'object' || !isDischarge(object) ||
   !('date' in object) || !z.iso.date({ message: 'Discharge date required' }).parse(object.date)) {
    throw new Error('Discharge data missing or wrong');
  }

  return object;
};

const isDischarge = (object: object): object is Discharge => {
  return 'criteria' in object && isString(object.criteria) && Object.values(object).length === 2;
};

export default { toNewPatientEntry, toNewEntry };