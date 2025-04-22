export const CATEGORIES = ["health", "hobby", "beauty", "other"] as const;

//treats the category array as individual elements of the array
//without [number], it would be the entire array, without individual elements
export type Category = (typeof CATEGORIES)[number];
