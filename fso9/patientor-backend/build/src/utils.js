"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newEntrySchema = void 0;
const types_1 = require("./types");
const zod_1 = require("zod");
const toNewPatientEntry = (object) => {
    return exports.newEntrySchema.parse(object);
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
exports.newEntrySchema = zod_1.z.object({
    name: zod_1.z.string(),
    dateOfBirth: zod_1.z.iso.date(),
    ssn: zod_1.z.string(),
    gender: zod_1.z.enum(types_1.Gender),
    occupation: zod_1.z.string()
});
/*
const parseProperty = (property: unknown): string => {
  if (!isString(property) || property.length < 1) {
    throw new Error('Incorrect or missing property');
  }

  return property;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

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
exports.default = toNewPatientEntry;
