import { useEffect, useState } from 'react';
import { MegaSenaResult, NumberStatistics, DrawFrequency } from '../types';

export const useStatistics = (results: MegaSenaResult[]) => {
  const [numberStats, setNumberStats] = useState<NumberStatistics[]>([]);
  const [drawFrequency, setDrawFrequency] = useState<DrawFrequency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (results.length > 0) {
      calculateStatistics();
    }
  }, [results]);

  const calculateStatistics = () => {
    setLoading(true);
    
    try {
      // Initialize statistics arrays
      const stats = Array.from({ length: 60 }, (_, i) => ({
        number: i + 1,
        frequency: 0,
        percentage: 0,
        lastAppearance: 0,
      }));
      
      // Calculate frequency for each number
      results.forEach((result, index) => {
        result.dezenas.forEach((number) => {
          const num = parseInt(number);
          if (num >= 1 && num <= 60) {
            const statIndex = num - 1;
            stats[statIndex].frequency += 1;
            
            // Update last appearance (in number of draws ago)
            if (stats[statIndex].lastAppearance === 0) {
              stats[statIndex].lastAppearance = index;
            }
          }
        });
      });
      
      // Calculate percentages
      const totalDraws = results.length;
      stats.forEach((stat) => {
        stat.percentage = (stat.frequency / totalDraws) * 100;
      });
      
      // Sort by frequency for common draws analysis
      const frequencySorted = [...stats].sort((a, b) => b.frequency - a.frequency);
      
      setNumberStats(stats);
      setDrawFrequency(frequencySorted.map(({ number, frequency }) => ({ number, frequency })));
    } catch (error) {
      console.error('Error calculating statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    numberStats,
    drawFrequency,
    loading,
  };
};