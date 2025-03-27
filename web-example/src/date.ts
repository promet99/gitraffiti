import { addDays, format, getYear } from "date-fns";
import { PromiseFsClient } from "isomorphic-git";
import { commit, formatDateToTimestamp } from "./util";

export const makeDate = (
  y: number,
  m: number,
  d: number,
  h: number,
  min: number,
  s: number
) => {
  const currentDate = new Date();
  currentDate.setFullYear(y);
  currentDate.setMonth(m);
  currentDate.setDate(d);
  currentDate.setHours(h);
  currentDate.setMinutes(min);
  currentDate.setSeconds(s);
  return currentDate;
};

export const makeYearArray = (y: number) => {
  const yearArray: [string, number][] = [];
  const startDate = new Date(y, 0, 1);
  let currentDate = startDate;
  while (getYear(currentDate) == y) {
    const formattedDate = format(currentDate, "yyyy/MM/dd") + " 12:00:00";
    yearArray.push([formattedDate, 0]);
    currentDate = addDays(currentDate, 1);
  }
  return yearArray;
};

export const commitFromYearArray = async (
  fs: PromiseFsClient,
  yearArray: [string, number][],
  commitOptions: { name: string; email: string; message: string }
) => {
  for (const [dateString, count] of yearArray) {
    const currentDate = new Date(dateString);
    for (let i = 0; i < count; i++) {
      await commit(fs, {
        ...commitOptions,
        timestamp: formatDateToTimestamp(currentDate),
      });
    }
  }
};
