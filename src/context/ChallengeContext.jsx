import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createDays, detectMissed, computeCompensation } from '../lib/challengeLogic';

const ChallengeContext = createContext(null);

export const useChallenge = () => {
  const ctx = useContext(ChallengeContext);
  if (!ctx) throw new Error('useChallenge must be inside ChallengeProvider');
  return ctx;
};

const STORAGE_KEY = 'mission_path_challenge';

export function ChallengeProvider({ children }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.startDate && !parsed.failed && !parsed.completedAll) {
          const { updated, failed } = detectMissed(parsed.days, parsed.startDate);
          const updatedChallenge = { ...parsed, days: updated, failed: failed || parsed.failed };
          setChallenge(updatedChallenge);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChallenge));
        } else {
          setChallenge(parsed);
        }
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const startChallenge = useCallback((title, description, aiGenerated = false) => {
    const startDate = new Date().toISOString();
    const newChallenge = {
      id: Date.now().toString(),
      title,
      description,
      aiGenerated,
      startDate,
      days: createDays(),
      completedAll: false,
      failed: false,
      failedAt: null,
      snakeHighScore: 0,
    };
    setChallenge(newChallenge);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newChallenge));
  }, []);

  const completeDay = useCallback((dayId, { description, fileName, fileType, summary }) => {
    setChallenge(prev => {
      if (!prev) return prev;
      const days = prev.days.map(d => {
        if (d.id !== dayId) return d;
        return {
          ...d,
          status: 'completed',
          description,
          fileName,
          fileType,
          summary,
          completedAt: new Date().toISOString(),
        };
      });

      const nextIdx = days.findIndex(d => d.id === dayId + 1);
      if (nextIdx !== -1 && days[nextIdx].status === 'locked') {
        days[nextIdx] = { ...days[nextIdx], status: 'available' };
      }

      const originalDone = days.filter(d => d.id <= 30 && d.status === 'completed').length;
      const completedAll = originalDone === 30;

      const updated = { ...prev, days, completedAll };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeMissedDay = useCallback((missedDayId, data) => {
    setChallenge(prev => {
      if (!prev) return prev;
      const days = prev.days.map(d => {
        if (d.id !== missedDayId) return d;
        return {
          ...d,
          status: 'compensated',
          description: data.description,
          fileName: data.fileName,
          fileType: data.fileType,
          summary: data.summary,
          compensatedAt: new Date().toISOString(),
        };
      });
      const updated = { ...prev, days };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const failChallenge = useCallback(() => {
    setChallenge(prev => {
      if (!prev) return prev;
      const updated = { ...prev, failed: true, failedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetChallenge = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChallenge(null);
  }, []);

  const updateSnakeScore = useCallback((score) => {
    setChallenge(prev => {
      if (!prev) return prev;
      const snakeHighScore = Math.max(prev.snakeHighScore || 0, score);
      const updated = { ...prev, snakeHighScore };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const stats = challenge ? {
    completed: challenge.days.filter(d => d.status === 'completed').length,
    compensated: challenge.days.filter(d => d.status === 'compensated').length,
    missed: challenge.days.filter(d => d.status === 'missed').length,
    available: challenge.days.filter(d => d.status === 'available').length,
    total: challenge.days.length,
    currentDay: challenge.days.findIndex(d => d.status === 'available') + 1 || 30,
    missedQueue: computeCompensation(challenge.days),
  } : null;

  const todayDay = challenge
    ? challenge.days.find(d => d.status === 'available') || null
    : null;

  return (
    <ChallengeContext.Provider value={{
      challenge,
      loading,
      stats,
      todayDay,
      startChallenge,
      completeDay,
      completeMissedDay,
      failChallenge,
      resetChallenge,
      updateSnakeScore,
    }}>
      {children}
    </ChallengeContext.Provider>
  );
}
