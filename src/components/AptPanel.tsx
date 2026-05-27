import { useEffect, useState, type KeyboardEvent } from "react";
import { PRIORITY_COLORS, PRIORITY_LEVELS } from "../constants/priority";
import type { AptNote } from "../types/aptNote";
import type { Apartment, Priority } from "../types/apartment";
import "./AptPanel.scss";

type AptPanelProps = {
  isOpen: boolean;
  apt: Apartment | null;
  aptId: string | null;
  note: AptNote;
  toast: { message: string; isError: boolean } | null;
  onClose: () => void;
  onSetPriority: (priority: Priority) => void;
  onClearPriority: () => void;
  onUpdateNote: (partial: Partial<AptNote>) => Promise<boolean>;
};

const hasSavedNoteContent = (note: AptNote): boolean =>
  Boolean(note.listingUrl.trim() || note.memo.trim());

export const AptPanel = ({
  isOpen,
  apt,
  aptId,
  note,
  toast,
  onClose,
  onSetPriority,
  onClearPriority,
  onUpdateNote,
}: AptPanelProps) => {
  const [listingUrl, setListingUrl] = useState("");
  const [memo, setMemo] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(true);

  const currentPriority = note.priority;
  const hasSavedNote = hasSavedNoteContent(note);

  useEffect(() => {
    setListingUrl(note.listingUrl);
    setMemo(note.memo);
    setIsEditingNote(!hasSavedNoteContent(note));
  }, [aptId]);

  const handlePanelCloseKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClose();
    }
  };

  const handlePriorityKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    priority: Priority
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSetPriority(priority);
    }
  };

  const handleClearKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClearPriority();
    }
  };

  const handleStartEdit = () => {
    setListingUrl(note.listingUrl);
    setMemo(note.memo);
    setIsEditingNote(true);
  };

  const handleCancelEdit = () => {
    setListingUrl(note.listingUrl);
    setMemo(note.memo);
    setIsEditingNote(false);
  };

  const handleSaveNote = async () => {
    if (!aptId) return;

    const saved = await onUpdateNote({
      listingUrl: listingUrl.trim(),
      memo: memo.trim(),
    });

    if (saved) {
      setIsEditingNote(!hasSavedNoteContent({
        ...note,
        listingUrl: listingUrl.trim(),
        memo: memo.trim(),
      }));
    }
  };

  const handleSaveNoteKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSaveNote();
    }
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleStartEdit();
    }
  };

  const handleStopPanelClose = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <aside
      id="apt-panel"
      className={`apt-panel${isOpen ? " is-open" : ""}`}
      aria-label="아파트 상세 및 우선순위"
      onMouseDown={handleStopPanelClose}
      onClick={handleStopPanelClose}
    >
      <button
        type="button"
        className="panel-close"
        aria-label="패널 닫기"
        onClick={onClose}
        onKeyDown={handlePanelCloseKeyDown}
      >
        ×
      </button>

      {apt && aptId ? (
        <div id="apt-panel-body">
          <div className="title">{apt.name}</div>
          <div>
            <span className="panel-label">준공년도 ·</span> {apt.year}
          </div>
          <div>
            <span className="panel-label">주소 ·</span> {apt.address}
          </div>

          <div className="priority-section">
            <div className="priority-status">
              {currentPriority ? (
                <>방문 우선순위: {currentPriority}순위</>
              ) : (
                <div className="priority-label">현재: 미지정</div>
              )}
            </div>
            <div
              className="priority-buttons"
              role="group"
              aria-label="우선순위 선택"
            >
              {PRIORITY_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`priority-btn${currentPriority === level ? " is-active" : ""}`}
                  style={{ background: PRIORITY_COLORS[level] }}
                  aria-label={`우선순위 ${level}`}
                  aria-pressed={currentPriority === level}
                  onClick={() => onSetPriority(level)}
                  onKeyDown={(e) => handlePriorityKeyDown(e, level)}
                >
                  {level}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="priority-clear"
              onClick={onClearPriority}
              onKeyDown={handleClearKeyDown}
            >
              우선순위 해제
            </button>
          </div>

          <div className="note-section">
            <div className="note-section-header">
              <span className="field-label">부동산 정보</span>
              {hasSavedNote && !isEditingNote && (
                <button
                  type="button"
                  className="note-edit-btn"
                  aria-label="부동산 URL 및 메모 수정"
                  onClick={handleStartEdit}
                  onKeyDown={handleEditKeyDown}
                >
                  수정
                </button>
              )}
            </div>

            {isEditingNote ? (
              <div className="note-edit-form">
                <label className="field-sublabel" htmlFor="listing-url">
                  부동산 상세 URL
                </label>
                <input
                  id="listing-url"
                  type="url"
                  className="field-input"
                  placeholder="https://..."
                  value={listingUrl}
                  onChange={(e) => setListingUrl(e.target.value)}
                />

                <label className="field-sublabel" htmlFor="apt-memo">
                  메모
                </label>
                <textarea
                  id="apt-memo"
                  className="field-textarea"
                  placeholder="메모를 입력하세요"
                  rows={4}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />

                <div className="note-actions">
                  <button
                    type="button"
                    className="note-save-btn"
                    onClick={handleSaveNote}
                    onKeyDown={handleSaveNoteKeyDown}
                  >
                    저장
                  </button>
                  {hasSavedNote && (
                    <button
                      type="button"
                      className="note-cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      취소
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="note-view">
                <div className="note-view-row">
                  <span className="field-sublabel">부동산 상세 URL</span>
                  {note.listingUrl.trim() ? (
                    <a
                      href={note.listingUrl.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="field-link"
                    >
                      {note.listingUrl.trim()}
                    </a>
                  ) : (
                    <span className="note-empty">—</span>
                  )}
                </div>
                <div className="note-view-row">
                  <span className="field-sublabel">메모</span>
                  <p className="note-view-memo">
                    {note.memo.trim() ? note.memo : "—"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id="apt-panel-body">
          <p>마커를 클릭해 주세요.</p>
        </div>
      )}

      <p
        className={`save-toast${toast?.isError ? " is-error" : ""}`}
        aria-live="polite"
      >
        {toast?.message ?? ""}
      </p>
    </aside>
  );
};
