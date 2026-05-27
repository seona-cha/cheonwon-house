import type { Priority } from "./apartment";

export type AptNote = {
  priority: Priority | null;
  listingUrl: string;
  memo: string;
};

export type AptNotes = Record<string, AptNote>;

export const EMPTY_APT_NOTE: AptNote = {
  priority: null,
  listingUrl: "",
  memo: "",
};
