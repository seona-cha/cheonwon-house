import { useCallback, useMemo, useRef, useState } from "react";
import apartmentsData from "./data/apartments.json";
import { AptPanel } from "./components/AptPanel";
import { AuthStatus } from "./components/AuthStatus";
import { FirebaseSetupGuide } from "./components/FirebaseSetupGuide";
import { Legend } from "./components/Legend";
import { MapView } from "./components/MapView";
import { useAptNotes } from "./hooks/useAptNotes";
import { useAuth } from "./hooks/useAuth";
import { useNaverMapScript } from "./hooks/useNaverMapScript";
import { isFirebaseConfigured } from "./lib/firebase";
import type { AptNote } from "./types/aptNote";
import { EMPTY_APT_NOTE } from "./types/aptNote";
import { getAptNoteOrEmpty } from "./utils/aptNotes";
import type { Apartment, Priority } from "./types/apartment";
import { getAptId } from "./utils/apartment";
import "./styles/global.scss";
import "./styles/info-window.scss";

const apartments = apartmentsData as Apartment[];

const App = () => {
  const isScriptLoaded = useNaverMapScript();
  const { user, isLoading: isAuthLoading, error: authError, retry: retryAuth } =
    useAuth();
  const {
    aptNotes,
    priorities,
    isLoading: isNotesLoading,
    toast,
    updateNote,
    setPriority,
    showToast,
  } = useAptNotes(user?.uid);

  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const suppressOutsideCloseRef = useRef(false);

  const selectedApt = useMemo(
    () => apartments.find((apt) => getAptId(apt) === selectedAptId) ?? null,
    [selectedAptId]
  );

  const selectedNote = selectedAptId
    ? getAptNoteOrEmpty(aptNotes, selectedAptId)
    : EMPTY_APT_NOTE;

  const handleSelectApt = useCallback((_apt: Apartment, aptId: string) => {
    setSelectedAptId(aptId);
    setIsPanelOpen(true);
  }, []);

  const handleCloseOverlays = useCallback(() => {
    setSelectedAptId(null);
    setIsPanelOpen(false);
  }, []);

  const handleSetPriority = useCallback(
    (priority: Priority) => {
      if (!selectedAptId) return;
      setPriority(selectedAptId, priority);
    },
    [selectedAptId, setPriority]
  );

  const handleClearPriority = useCallback(() => {
    if (!selectedAptId) return;
    setPriority(selectedAptId, null);
  }, [selectedAptId, setPriority]);

  const handleUpdateNote = useCallback(
    async (partial: Partial<AptNote>): Promise<boolean> => {
      if (!selectedAptId) return false;
      const saved = await updateNote(selectedAptId, partial);
      if (saved) {
        showToast("저장됨");
      }
      return saved;
    },
    [selectedAptId, updateNote, showToast]
  );

  if (!import.meta.env.VITE_NAVER_MAP_KEY) {
    return (
      <div className="app-error">
        <p>
          <code>VITE_NAVER_MAP_KEY</code>를 <code>.env</code>에 설정해 주세요.
        </p>
      </div>
    );
  }

  if (!isFirebaseConfigured()) {
    return (
      <div className="app-error">
        <p>
          Firebase 환경 변수가 없습니다. <code>FIREBASE_SETUP.md</code>를
          참고해 <code>.env</code>를 설정해 주세요.
        </p>
      </div>
    );
  }

  if (authError && !isAuthLoading) {
    return <FirebaseSetupGuide error={authError} onRetry={retryAuth} />;
  }

  return (
    <>
      <MapView
        isScriptLoaded={isScriptLoaded}
        priorities={priorities}
        selectedAptId={selectedAptId}
        isPanelOpen={isPanelOpen}
        onSelectApt={handleSelectApt}
        onCloseOverlays={handleCloseOverlays}
        suppressOutsideCloseRef={suppressOutsideCloseRef}
      />
      <AptPanel
        isOpen={isPanelOpen}
        apt={selectedApt}
        aptId={selectedAptId}
        note={selectedNote}
        toast={toast}
        onClose={handleCloseOverlays}
        onSetPriority={handleSetPriority}
        onClearPriority={handleClearPriority}
        onUpdateNote={handleUpdateNote}
      />
      <Legend />
      <AuthStatus
        isLoading={isAuthLoading}
        error={authError}
        isNotesLoading={isNotesLoading}
      />
    </>
  );
};

export default App;
