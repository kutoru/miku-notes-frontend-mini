import type { FileInfo } from "./file";

export type Shelf = {
  id: number;
  created: number;
  last_edited: number;
  times_edited: number;
  text: string;
  user_id: number;
  files: FileInfo[];
};
