import { useEffect, useRef } from 'react';
import { type TranscriptViewerProps, type Interview, type Chunk } from '../types';
import styles from './TranscriptViewer.module.css';

export function TranscriptViewer({
  interviews,
  open,
  onClose,
  focusedSource,
}: TranscriptViewerProps) {
  const chunkRefs = useRef<Record<number, HTMLDivElement | null>>({});

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

  if (!focusedSource) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.drawer}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.headerTitle}>Transcript</h3>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.emptyState}>
              No transcript reference available
            </div>
          </div>
        </div>
      </div>
    );
  }

  const interview = interviews.find(
    (i: Interview) => i.interview_id === focusedSource.interview_id
  );

  if (!interview) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.drawer}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.headerTitle}>Transcript Not Found</h3>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.missingMessage}>
              Interview with ID {focusedSource.interview_id} not found.
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
          <div>
            <h3 className={styles.headerTitle}>
              {interview.interviewee_first_name} - {interview.interviewee_role}
            </h3>
            <p className={styles.headerSubtitle}>
              Full Interview Transcript
            </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {interview.chunks.map((chunk: Chunk) => {
            const isHighlighted = focusedSource.chunk_numbers.includes(chunk.chunk_number);
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
                      ? interview.interviewee_first_name
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
