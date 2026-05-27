import apartments from "../data/apartments.json";
import { PRIORITY_STORAGE_KEY } from "../constants/priority";
import type { Apartment, Priority, Priorities } from "../types/apartment";
import { getAptId } from "./apartment";

const LEGACY_STORAGE_KEYS = [
  PRIORITY_STORAGE_KEY,
  "cheonwon-apartment-priorities",
];

export const loadPriorities = (): Priorities => {
  const merged: Record<string, unknown> = {};

  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (!raw) continue;
      Object.assign(merged, JSON.parse(raw) as Record<string, unknown>);
    } catch {
      /* ignore */
    }
  }

  const migrated: Priorities = {};

  (apartments as Apartment[]).forEach((apt, index) => {
    const aptId = getAptId(apt);
    const legacyNameKey = `${apt.name}|${apt.address}`;
    const indexKey = String(index);

    const raw =
      merged[aptId] ??
      merged[apt.address] ??
      merged[legacyNameKey] ??
      merged[indexKey] ??
      merged[index];

    if (raw != null) {
      const value = Number(raw);
      if (value >= 1 && value <= 5) {
        migrated[aptId] = value as Priority;
      }
    }
  });

  return migrated;
};

export const savePriorities = (priorities: Priorities): boolean => {
  const json = JSON.stringify(priorities);

  try {
    localStorage.setItem(PRIORITY_STORAGE_KEY, json);
    sessionStorage.setItem(PRIORITY_STORAGE_KEY, json);
    return true;
  } catch (err) {
    console.warn("우선순위 저장 실패:", err);
    try {
      sessionStorage.setItem(PRIORITY_STORAGE_KEY, json);
      return true;
    } catch {
      return false;
    }
  }
};
