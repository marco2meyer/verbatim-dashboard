import { useEffect, useRef, useState } from 'react';
import { type TranscriptViewerProps, type Interview, type Chunk } from '../types';
import styles from './TranscriptViewer.module.css';

export function TranscriptViewer({
  interviews,
  open,
  onClose,
  focusedSource,
}: TranscriptViewerProps) {
  const chunkRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);

  // When focusedSource changes, update selected interview
  useEffect(() => {
    if (focusedSource) {
      setSelectedInterviewId(focusedSource.interview_id);
    } else if (interviews.length > 0 && !selectedInterviewId) {
      // Default to first interview if none selected
      setSelectedInterviewId(interviews[0].interview_id);
    }
  }, [focusedSource, interviews, selectedInterviewId]);

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
                </div>
                <div className={styles.chunkText}>{chunk.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
