import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { type ValueOverview } from '../types';
import { TranscriptViewer } from '../components/TranscriptViewer';
import styles from './ValuesOverviewPage.module.css';

export function ValuesOverviewPage() {
  const { data, loading, error } = useData();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'importance' | 'realization' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [transcriptViewerOpen, setTranscriptViewerOpen] = useState(false);
  const [focusedSource, setFocusedSource] = useState<{ interview_id: string; chunk_numbers: number[] } | undefined>();

  const sortedValues = useMemo(() => {
    if (!data?.values_overview) return [];

    let sorted = [...data.values_overview];

    if (sortBy) {
      sorted.sort((a, b) => {
        const aValue = sortBy === 'importance' ? a.importance_1_to_10 : a.realization_1_to_10;
        const bValue = sortBy === 'importance' ? b.importance_1_to_10 : b.realization_1_to_10;
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      });
    }

    return sorted;
  }, [data, sortBy, sortOrder]);

  const handleSort = (column: 'importance' | 'realization') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleRowClick = (valueId: string) => {
    navigate(`/value/${valueId}`);
  };

  const parseExample = (example: string) => {
    // Extract the quote text (between first " and last " before the parenthesis)
    const quoteMatch = example.match(/^"(.+?)"\s*\(/);
    const quote = quoteMatch ? quoteMatch[1] : example;

    // Extract interview_id and chunk number
    const interviewIdMatch = example.match(/interview_id:\s*([a-f0-9-]+)/);
    const chunkMatch = example.match(/chunk:\s*(\d+)/);

    return {
      quote,
      interview_id: interviewIdMatch ? interviewIdMatch[1] : null,
      chunk_number: chunkMatch ? parseInt(chunkMatch[1]) : null,
    };
  };

  const handleExampleClick = (e: React.MouseEvent, example: string) => {
    e.stopPropagation();
    const parsed = parseExample(example);
    if (parsed.interview_id && parsed.chunk_number) {
      setFocusedSource({
        interview_id: parsed.interview_id,
        chunk_numbers: [parsed.chunk_number],
      });
      setTranscriptViewerOpen(true);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState} style={{ color: 'var(--color-error)' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data || !sortedValues.length) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>No values data available</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Values Overview</h2>
        <button
          className="btn btn-ghost"
          onClick={() => setTranscriptViewerOpen(true)}
          style={{ marginBottom: 'var(--spacing-lg)' }}
        >
          View Interview Transcripts
        </button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div>Value</div>
          <div>Example</div>
          <div
            onClick={() => handleSort('importance')}
            style={{ cursor: 'pointer' }}
            className={styles.tooltip}
          >
            Importance {sortBy === 'importance' && (sortOrder === 'desc' ? '↓' : '↑')}
            <span className={styles.tooltipText}>
              How central and widely recognized this value is across interviews (1-10 scale)
            </span>
          </div>
          <div
            onClick={() => handleSort('realization')}
            style={{ cursor: 'pointer' }}
            className={styles.tooltip}
          >
            Realization {sortBy === 'realization' && (sortOrder === 'desc' ? '↓' : '↑')}
            <span className={styles.tooltipText}>
              How well this value is being lived out in practice today (1-10 scale)
            </span>
          </div>
          <div></div>
        </div>

        {sortedValues.map((value: ValueOverview) => (
          <div
            key={value.value_id}
            className={styles.tableRow}
            onClick={() => handleRowClick(value.value_id)}
          >
            <div className={styles.valueLabel}>{value.label}</div>

            <div
              className={styles.exampleCell}
              onClick={(e) => handleExampleClick(e, value.interviewee_wording_examples[0])}
              title="Click to view in transcript"
            >
              {value.interviewee_wording_examples.length > 0
                ? parseExample(value.interviewee_wording_examples[0]).quote
                : 'No examples available'}
            </div>

            <div className={styles.scoreColumn}>
              <span className={`${styles.scoreValue} ${styles.importance}`}>
                {value.importance_1_to_10}/10
              </span>
              <div className={styles.scoreBar}>
                <div
                  className={`${styles.scoreFill} ${styles.importance}`}
                  style={{ width: `${(value.importance_1_to_10 / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.scoreColumn}>
              <span className={`${styles.scoreValue} ${styles.realization}`}>
                {value.realization_1_to_10}/10
              </span>
              <div className={styles.scoreBar}>
                <div
                  className={`${styles.scoreFill} ${styles.realization}`}
                  style={{ width: `${(value.realization_1_to_10 / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.arrow}>→</div>
          </div>
        ))}
      </div>

      <TranscriptViewer
        interviews={data?.interviews_raw || []}
        open={transcriptViewerOpen}
        onClose={() => setTranscriptViewerOpen(false)}
        focusedSource={focusedSource}
      />
    </div>
  );
}
