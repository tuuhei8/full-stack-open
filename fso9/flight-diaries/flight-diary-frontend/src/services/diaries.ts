import axios from "axios";
import type { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<NonSensitiveDiaryEntry[]>(
    `${apiBaseUrl}/diaries`
  );

  return data;
};

const postNewEntry = async (object: NewDiaryEntry) => {
  const { data } = await axios.post<DiaryEntry>(
   `${apiBaseUrl}/diaries`,
   object
  );

  return data;
};

export default { getAll, postNewEntry };