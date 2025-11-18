import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { type ValueOverview } from '../types';
import styles from './ValuesOverviewPage.module.css';

export function ValuesOverviewPage() {
  const { data, loading, error } = useData();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'salience' | 'actualization' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedValues = useMemo(() => {
    if (!data?.values_overview) return [];

    let sorted = [...data.values_overview];

    if (sortBy) {
      sorted.sort((a, b) => {
        const aValue = sortBy === 'salience' ? a.salience_0_to_5 : a.actualization_0_to_10;
        const bValue = sortBy === 'salience' ? b.salience_0_to_5 : b.actualization_0_to_10;
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      });
    }

    return sorted;
  }, [data, sortBy, sortOrder]);

  const handleSort = (column: 'salience' | 'actualization') => {
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

  const formatWording = (examples: string[]) => {
    if (!examples.length) return 'No examples available';
    return examples[0].substring(0, 150) + (examples[0].length > 150 ? '...' : '');
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
        <p className={styles.pageDescription}>
          This dashboard visualizes the core values identified from interview data,
          showing both how salient (important) each value is and how well it's being actualized in practice.
        </p>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div>Value</div>
          <div>Interviewee Wording</div>
          <div
            onClick={() => handleSort('salience')}
            style={{ cursor: 'pointer' }}
          >
            Salience {sortBy === 'salience' && (sortOrder === 'desc' ? '↓' : '↑')}
          </div>
          <div
            onClick={() => handleSort('actualization')}
            style={{ cursor: 'pointer' }}
          >
            Actualization {sortBy === 'actualization' && (sortOrder === 'desc' ? '↓' : '↑')}
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

            <div className={styles.wordingExamples}>
              {formatWording(value.interviewee_wording_examples)}
            </div>

            <div className={styles.scoreColumn}>
              <span className={`${styles.scoreValue} ${styles.salience}`}>
                {value.salience_0_to_5}/5
              </span>
              <div className={styles.scoreBar}>
                <div
                  className={`${styles.scoreFill} ${styles.salience}`}
                  style={{ width: `${(value.salience_0_to_5 / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.scoreColumn}>
              <span className={`${styles.scoreValue} ${styles.actualization}`}>
                {value.actualization_0_to_10}/10
              </span>
              <div className={styles.scoreBar}>
                <div
                  className={`${styles.scoreFill} ${styles.actualization}`}
                  style={{ width: `${(value.actualization_0_to_10 / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.arrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}
