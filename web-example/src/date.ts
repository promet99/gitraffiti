import { addDays, getDay, getDaysInYear, setDayOfYear } from "date-fns";
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

export type CommitArray = {
  year: number;
  values: number[];
};

export const createCommitArray = (year: number): CommitArray => {
  const days = getDaysInYear(new Date(year, 0, 1));
  return {
    year,
    values: Array(days).fill(0),
  };
};

export const commitFromYearArray = async (
  fs: PromiseFsClient,
  yearArray: CommitArray,
  commitOptions: { name: string; email: string; message: string }
) => {
  for (let i = 0; i < yearArray.values.length; i++) {
    const count = yearArray.values[i];
    const currentDate = setDayOfYear(new Date(yearArray.year, 0, 1), i + 1);
    for (let j = 0; j < count; j++) {
      await commit(fs, {
        ...commitOptions,
        timestamp: formatDateToTimestamp(currentDate),
      });
    }
  }
};

export const moveCommitArray = (
  commitArray: CommitArray,
  direction: "left" | "right" | "up" | "down",
  amount: number
): CommitArray => {
  const newCommitArray = createCommitArray(commitArray.year);
  const fd = new Date(commitArray.year, 0, 1);
  newCommitArray.values = commitArray.values.map((_, index) => {
    const day = getDay(addDays(fd, index));
    if (direction === "left") {
      return commitArray.values[index + 7 * amount] || 0;
    } else if (direction === "right") {
      return commitArray.values[index - 7 * amount] || 0;
    } else if (direction === "up") {
      return day === 6 ? 0 : commitArray.values[index + 1] || 0;
    } else if (direction === "down") {
      return day === 0 ? 0 : commitArray.values[index - 1] || 0;
    }
    return 0;
  });

  return newCommitArray;
};
