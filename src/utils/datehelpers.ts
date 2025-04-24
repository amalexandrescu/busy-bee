import { Timestamp } from "firebase/firestore";

//eg. 2025-04-26
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//eg. April 2025
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

//gets the start and end of a month
export const getMonthRange = (
  date: Date
): { start: Timestamp; end: Timestamp } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end),
  };
};
