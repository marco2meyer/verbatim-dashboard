import { useEffect, useRef, useState } from 'react';
import { type TranscriptViewerProps, type Interview, type Chunk } from '../types';
import { useData } from '../context/DataContext';
import styles from './TranscriptViewer.module.css';

export function TranscriptViewer({
  interviews,
  open,
  onClose,
  focusedSource,
}: TranscriptViewerProps) {
  const chunkRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [editingChunk, setEditingChunk] = useState<{ interviewId: string; chunkNumber: number } | null>(null);
  const [editText, setEditText] = useState<string>('');
  const { data, saveData } = useData();

  // When focusedSource changes, update selected interview
  useEffect(() => {
    if (focusedSource) {
      setSelectedInterviewId(focusedSource.interview_id);
    } else if (interviews.length > 0 && selectedInterviewId === null) {
      // Default to first interview if none selected
      setSelectedInterviewId(interviews[0].interview_id);
    }
  }, [focusedSource, interviews]);

  useEffect(() => {
    if (!focusedSource || !open) return;

    const firstChunk = focusedSource.chunk_numbers[0];
    const el = chunkRefs.current[firstChunk];

    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [focusedSource, open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentInterview = interviews.find(
    (i: Interview) => i.interview_id === selectedInterviewId
  );

  const handleInterviewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInterviewId(e.target.value);
  };

  const handleEditClick = (interviewId: string, chunk: Chunk) => {
    setEditingChunk({ interviewId, chunkNumber: chunk.chunk_number });
    setEditText(chunk.edited_text || chunk.text);
  };

  const handleCancelEdit = () => {
    setEditingChunk(null);
    setEditText('');
  };

  const handleSaveEdit = async () => {
    if (!editingChunk || !data) return;

    const updatedData = { ...data };
    const interview = updatedData.interviews_raw.find(
      (i) => i.interview_id === editingChunk.interviewId
    );

    if (interview) {
      const chunk = interview.chunks.find((c) => c.chunk_number === editingChunk.chunkNumber);
      if (chunk) {
        // Only set edited_text if it's different from the original
        if (editText !== chunk.text) {
          chunk.edited_text = editText;
        } else {
          delete chunk.edited_text;
        }
      }
    }

    try {
      await saveData(updatedData);
      setEditingChunk(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to save edit:', err);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleRestoreOriginal = async (interviewId: string, chunkNumber: number) => {
    if (!data) return;

    const updatedData = { ...data };
    const interview = updatedData.interviews_raw.find((i) => i.interview_id === interviewId);

    if (interview) {
      const chunk = interview.chunks.find((c) => c.chunk_number === chunkNumber);
      if (chunk) {
        delete chunk.edited_text;
      }
    }

    try {
      await saveData(updatedData);
    } catch (err) {
      console.error('Failed to restore original:', err);
      alert('Failed to restore original text. Please try again.');
    }
  };

  const getDisplayText = (chunk: Chunk) => {
    return chunk.edited_text || chunk.text;
  };

  if (!currentInterview) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.drawer}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.headerTitle}>Transcripts</h3>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.emptyState}>
              No interviews available
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h3 className={styles.headerTitle}>Interview Transcript</h3>
            <select
              className={styles.interviewSelect}
              value={selectedInterviewId || ''}
              onChange={handleInterviewChange}
            >
              {interviews.map((interview: Interview) => (
                <option key={interview.interview_id} value={interview.interview_id}>
                  {interview.interviewee_first_name} - {interview.interviewee_role}
                </option>
              ))}
            </select>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {currentInterview.chunks.map((chunk: Chunk) => {
            const isHighlighted = focusedSource?.chunk_numbers.includes(chunk.chunk_number) &&
                                  focusedSource?.interview_id === currentInterview.interview_id;
            const chunkClass = chunk.speaker === 'interviewee'
              ? styles.chunkInterviewee
              : styles.chunkInterviewer;
            const highlightClass = isHighlighted ? styles.chunkHighlight : '';
            const isEditing = editingChunk?.interviewId === currentInterview.interview_id &&
                            editingChunk?.chunkNumber === chunk.chunk_number;
            const hasEdit = !!chunk.edited_text;

            return (
              <div
                key={chunk.chunk_number}
                ref={(el) => { chunkRefs.current[chunk.chunk_number] = el; }}
                className={`${styles.chunk} ${chunkClass} ${highlightClass}`}
              >
                <div className={styles.chunkHeader}>
                  <span className={styles.chunkSpeaker}>
                    {chunk.speaker === 'interviewee'
                      ? currentInterview.interviewee_first_name
                      : 'Interviewer'}
                  </span>
                  <span className={styles.chunkNumber}>#{chunk.chunk_number}</span>
                  {!isEditing && (
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(currentInterview.interview_id, chunk)}
                      title="Edit this chunk"
                    >
                      ✎
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className={styles.editContainer}>
                    <textarea
                      className={styles.editTextarea}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={5}
                      autoFocus
                    />
                    <div className={styles.editButtons}>
                      <button className={styles.saveButton} onClick={handleSaveEdit}>
                        Save
                      </button>
                      <button className={styles.cancelButton} onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.chunkText}>{getDisplayText(chunk)}</div>
                    {hasEdit && (
                      <div className={styles.originalTextContainer}>
                        <div className={styles.originalTextLabel}>Original:</div>
                        <div className={styles.originalText}>{chunk.text}</div>
                        <button
                          className={styles.restoreButton}
                          onClick={() => handleRestoreOriginal(currentInterview.interview_id, chunk.chunk_number)}
                        >
                          Restore Original
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
