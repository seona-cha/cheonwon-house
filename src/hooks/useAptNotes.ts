import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getFirestoreDb } from "../lib/firebase";
import type { AptNote, AptNotes } from "../types/aptNote";
import type { Priority, Priorities } from "../types/apartment";
import { aptNotesToPriorities } from "../utils/aptNotes";
import { loadPriorities } from "../utils/priorities";

const MIGRATION_FLAG_KEY = "cheonwon-firebase-migrated";

type Toast = { message: string; isError: boolean } | null;

export const useAptNotes = (uid: string | undefined) => {
  const [aptNotes, setAptNotes] = useState<AptNotes>({});
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = useCallback((message: string, isError = false) => {
    setToast({ message, isError });
    window.setTimeout(() => setToast(null), 2000);
  }, []);

  const migrateLocalPriorities = useCallback(async (userId: string) => {
    if (localStorage.getItem(MIGRATION_FLAG_KEY)) return;

    const localPriorities = loadPriorities();
    const entries = Object.entries(localPriorities);
    if (entries.length === 0) {
      localStorage.setItem(MIGRATION_FLAG_KEY, "1");
      return;
    }

    const db = getFirestoreDb();
    const batch = writeBatch(db);

    for (const [aptId, priority] of entries) {
      const ref = doc(db, "users", userId, "apartmentNotes", aptId);
      batch.set(
        ref,
        {
          priority,
          listingUrl: "",
          memo: "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    await batch.commit();
    localStorage.setItem(MIGRATION_FLAG_KEY, "1");
    showToast("기존 우선순위를 Firebase로 옮겼습니다.");
  }, [showToast]);

  useEffect(() => {
    if (!uid) return;

    const db = getFirestoreDb();
    const notesRef = collection(db, "users", uid, "apartmentNotes");

    let isFirstSnapshot = true;

    const unsubscribe = onSnapshot(
      notesRef,
      (snapshot) => {
        const next: AptNotes = {};

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const priorityRaw = data.priority;
          const priority =
            priorityRaw != null &&
            Number(priorityRaw) >= 1 &&
            Number(priorityRaw) <= 5
              ? (Number(priorityRaw) as Priority)
              : null;

          next[docSnap.id] = {
            priority,
            listingUrl:
              typeof data.listingUrl === "string" ? data.listingUrl : "",
            memo: typeof data.memo === "string" ? data.memo : "",
          };
        });

        setAptNotes(next);

        if (isFirstSnapshot) {
          isFirstSnapshot = false;
          setIsLoading(false);
        }
      },
      (err) => {
        console.error(err);
        showToast("Firebase 데이터를 불러오지 못했습니다.", true);
        setIsLoading(false);
      }
    );

    migrateLocalPriorities(uid).catch((err) => {
      console.error(err);
    });

    return unsubscribe;
  }, [uid, migrateLocalPriorities, showToast]);

  const updateNote = useCallback(
    async (aptId: string, partial: Partial<AptNote>) => {
      if (!uid) return false;

      try {
        const db = getFirestoreDb();
        const ref = doc(db, "users", uid, "apartmentNotes", aptId);

        await setDoc(
          ref,
          {
            ...partial,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        return true;
      } catch (err) {
        console.error(err);
        showToast("저장에 실패했습니다.", true);
        return false;
      }
    },
    [uid, showToast]
  );

  const setPriority = useCallback(
    async (aptId: string, priority: Priority | null) => {
      const saved = await updateNote(aptId, { priority });
      if (saved) {
        showToast(
          priority ? `${priority}순위로 저장됨` : "우선순위 해제됨"
        );
      }
    },
    [updateNote, showToast]
  );

  const priorities: Priorities = useMemo(
    () => aptNotesToPriorities(aptNotes),
    [aptNotes]
  );

  return {
    aptNotes,
    priorities,
    isLoading,
    toast,
    updateNote,
    setPriority,
    showToast,
  };
};
