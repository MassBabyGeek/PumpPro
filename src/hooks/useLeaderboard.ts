import {useState, useEffect} from 'react';

export type LeaderboardEntry = {
  id: number;
  name: string;
  score: number;
  rank: number;
};

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      // const response = await fetch('/api/leaderboard');
      // const data = await response.json();

      // Mock data pour le moment
      const mockData: LeaderboardEntry[] = [
        {id: 1, name: 'Alex M.', score: 892, rank: 1},
        {id: 2, name: 'Sarah K.', score: 854, rank: 2},
        {id: 3, name: 'Mike R.', score: 831, rank: 3},
        {id: 4, name: 'Emma L.', score: 789, rank: 4},
        {id: 5, name: 'Tom W.', score: 756, rank: 5},
      ];

      setLeaderboard(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLeaderboard = () => {
    fetchLeaderboard();
  };

  return {
    leaderboard,
    isLoading,
    error,
    refreshLeaderboard,
  };
};
