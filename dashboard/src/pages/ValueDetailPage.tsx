import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { TranscriptViewer } from '../components/TranscriptViewer';
import { type StoryDetail, type EnablerOrBlockerDetail } from '../types';
import { getTextFromSource } from '../utils/chunkHelpers';
import styles from './ValueDetailPage.module.css';

export function ValueDetailPage() {
  const { valueId } = useParams<{ valueId: string }>();
  const { data } = useData();
  const navigate = useNavigate();
  const [transcriptViewerState, setTranscriptViewerState] = useState<{
    open: boolean;
    focusedSource?: { interview_id: string; chunk_numbers: number[] };
  }>({ open: false });

  if (!valueId || !data) {
    return <div className={styles.page}>Value not found</div>;
  }

  const valueOverview = data.values_overview.find(v => v.value_id === valueId);
  const valueDetails = data.value_details[valueId];

  if (!valueOverview || !valueDetails) {
    return <div className={styles.page}>Value not found</div>;
  }

  const handleViewTranscript = (source: { interview_id: string; chunk_numbers: number[] }) => {
    setTranscriptViewerState({
      open: true,
      focusedSource: source,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? styles.star : styles.starEmpty}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <button
        className="btn btn-ghost"
        onClick={() => navigate('/')}
        style={{ marginBottom: 'var(--spacing-xl)' }}
      >
        ← Back to Overview
      </button>

      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.headerTitle}>{valueDetails.label}</h2>
          <div className={styles.scores}>
            <div className={styles.scoreItem}>
              <div className={styles.scoreLabel}>Importance</div>
              <div className={`${styles.scoreValue} ${styles.importance}`}>
                {valueOverview.importance_1_to_10}/10
              </div>
            </div>
            <div className={styles.scoreItem}>
              <div className={styles.scoreLabel}>Realization</div>
              <div className={`${styles.scoreValue} ${styles.realization}`}>
                {valueOverview.realization_1_to_10}/10
              </div>
            </div>
          </div>
        </div>
        {valueOverview.comments && (
          <p className={styles.comments}>{valueOverview.comments}</p>
        )}
      </div>

      {/* Stories Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📖</span>
          Stories ({valueDetails.stories.length})
        </h3>
        {valueDetails.stories.length === 0 ? (
          <div className={styles.emptyState}>No stories available for this value.</div>
        ) : (
          <div className={styles.itemsGrid}>
            {valueDetails.stories.map((story: StoryDetail, index: number) => (
              <div
                key={index}
                className={`${styles.itemCard} ${styles.story}`}
                onClick={() => handleViewTranscript(story.source)}
              >
                <div className={styles.itemHeader}>
                  <h4 className={styles.itemTitle}>{story.short_name}</h4>
                  <div className={styles.itemMeta}>
                    {story.subtheme && (
                      <span className={styles.subthemeBadge}>{story.subtheme}</span>
                    )}
                    {renderStars(story.compellingness_1_to_5)}
                  </div>
                </div>
                <p className={styles.itemQuote}>
                  "{getTextFromSource(data.interviews_raw, story.source.interview_id, story.source.chunk_numbers) || story.quote_verbatim}"
                </p>
                <div className={styles.itemFooter}>
                  <div className={styles.itemAuthor}>
                    <strong>{story.interviewee_first_name}</strong>, {story.interviewee_role}
                  </div>
                  <div className={styles.viewTranscript}>
                    View in transcript →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enablers Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>✓</span>
          Enablers ({valueDetails.enablers.length})
        </h3>
        {valueDetails.enablers.length === 0 ? (
          <div className={styles.emptyState}>No enablers identified for this value.</div>
        ) : (
          <div className={styles.itemsGrid}>
            {valueDetails.enablers.map((enabler: EnablerOrBlockerDetail, index: number) => (
              <div
                key={index}
                className={`${styles.itemCard} ${styles.enabler}`}
                onClick={() => handleViewTranscript(enabler.source)}
              >
                <div className={styles.itemHeader}>
                  <h4 className={styles.itemTitle}>{enabler.short_name}</h4>
                  <div className={styles.itemMeta}>
                    {renderStars(enabler.importance_1_to_5)}
                  </div>
                </div>
                <p className={styles.itemQuote}>
                  "{getTextFromSource(data.interviews_raw, enabler.source.interview_id, enabler.source.chunk_numbers) || enabler.quote_with_name_and_role}"
                </p>
                <div className={styles.itemFooter}>
                  <div className={styles.viewTranscript}>
                    View in transcript →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Blockers Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>✗</span>
          Blockers ({valueDetails.blockers.length})
        </h3>
        {valueDetails.blockers.length === 0 ? (
          <div className={styles.emptyState}>No blockers identified for this value.</div>
        ) : (
          <div className={styles.itemsGrid}>
            {valueDetails.blockers.map((blocker: EnablerOrBlockerDetail, index: number) => (
              <div
                key={index}
                className={`${styles.itemCard} ${styles.blocker}`}
                onClick={() => handleViewTranscript(blocker.source)}
              >
                <div className={styles.itemHeader}>
                  <h4 className={styles.itemTitle}>{blocker.short_name}</h4>
                  <div className={styles.itemMeta}>
                    {renderStars(blocker.importance_1_to_5)}
                  </div>
                </div>
                <p className={styles.itemQuote}>
                  "{getTextFromSource(data.interviews_raw, blocker.source.interview_id, blocker.source.chunk_numbers) || blocker.quote_with_name_and_role}"
                </p>
                <div className={styles.itemFooter}>
                  <div className={styles.viewTranscript}>
                    View in transcript →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <TranscriptViewer
        interviews={data.interviews_raw}
        open={transcriptViewerState.open}
        onClose={() => setTranscriptViewerState({ open: false })}
        focusedSource={transcriptViewerState.focusedSource}
      />
    </div>
  );
}
