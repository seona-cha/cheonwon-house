import type { DocumentData } from "firebase/firestore";
import type { AptNote } from "../types/aptNote";
import { EMPTY_APT_NOTE } from "../types/aptNote";
import type { Priority, Priorities } from "../types/apartment";

export const parseAptNote = (data: DocumentData): AptNote => {
  const priorityRaw = data.priority;
  const priority =
    priorityRaw != null &&
    Number(priorityRaw) >= 1 &&
    Number(priorityRaw) <= 5
      ? (Number(priorityRaw) as Priority)
      : null;

  return {
    priority,
    listingUrl: typeof data.listingUrl === "string" ? data.listingUrl : "",
    memo: typeof data.memo === "string" ? data.memo : "",
  };
};

export const aptNotesToPriorities = (notes: Record<string, AptNote>): Priorities => {
  const priorities: Priorities = {};

  for (const [aptId, note] of Object.entries(notes)) {
    if (note.priority != null) {
      priorities[aptId] = note.priority;
    }
  }

  return priorities;
};

export const getAptNoteOrEmpty = (
  notes: Record<string, AptNote>,
  aptId: string
): AptNote => notes[aptId] ?? EMPTY_APT_NOTE;
