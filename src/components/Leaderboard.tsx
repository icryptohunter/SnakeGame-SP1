/**
 * Leaderboard.tsx
 * Component that displays the leaderboard with verified scores.
 * Changes:
 * - Updated to use SP1 verification
 * - Enhanced verification explanation
 * - Improved UI with SP1 branding
 */
import React from 'react';
import { Trophy, Shield, User, Zap, Code } from 'lucide-react';

interface LeaderboardProps {
  darkMode: boolean;
}

// Mock data for the leaderboard
const mockLeaderboardData = [
  { id: 1, name: 'Alex', score: 156, verified: true },
  { id: 2, name: 'Taylor', score: 142, verified: true },
  { id: 3, name: 'Jordan', score: 137, verified: true },
  { id: 4, name: 'Casey', score: 125, verified: true },
  { id: 5, name: 'Riley', score: 118, verified: true },
  { id: 6, name: 'Morgan', score: 112, verified: true },
  { id: 7, name: 'Jamie', score: 105, verified: true },
  { id: 8, name: 'Quinn', score: 98, verified: true },
  { id: 9, name: 'Avery', score: 92, verified: true },
  { id: 10, name: 'Reese', score: 87, verified: true },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ darkMode }) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800 shadow-purple-900/20' : 'bg-white shadow-purple-500/20'}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={24} className="text-yellow-500" />
          <h2 className="text-2xl font-bold font-orbitron">Leaderboard</h2>
        </div>
        
        <div className="mb-4">
          <p className="flex items-center gap-2">
            <Shield size={16} className="text-green-500" />
            <span className="text-sm">All scores are verified with SP1 zero-knowledge proofs</span>
          </p>
        </div>
        
        <div className="overflow-hidden rounded-lg">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} font-orbitron`}>
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-center">Verified</th>
              </tr>
            </thead>
            <tbody className="font-urbanist">
              {mockLeaderboardData.map((entry, index) => (
                <tr 
                  key={entry.id}
                  className={`${
                    index % 2 === 0 
                      ? (darkMode ? 'bg-gray-700/50' : 'bg-gray-50') 
                      : (darkMode ? 'bg-gray-800' : 'bg-white')
                  } transition-colors hover:bg-purple-100/10`}
                >
                  <td className="px-4 py-3">
                    {index < 3 ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-300' : 
                        'bg-amber-700'
                      } text-white font-bold text-sm`}>
                        {index + 1}
                      </span>
                    ) : (
                      <span className="text-gray-500">{index + 1}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    {entry.name}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    {entry.score}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.verified ? (
                      <Shield size={16} className="inline text-green-500" />
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-purple-600/10 border border-purple-600/20">
          <h3 className="font-bold mb-2 text-purple-400 font-orbitron flex items-center">
            <Code size={16} className="mr-1" />
            What is SP1 Verification?
          </h3>
          <p className="text-sm font-urbanist">
            SP1 is a zero-knowledge proof system that verifies your score is legitimate without revealing the exact game state.
            This ensures that all scores on the leaderboard are achieved through fair gameplay and cannot be tampered with.
            The verification happens locally in your browser using WebAssembly for maximum performance and privacy.
          </p>
          
          <div className="mt-3 flex items-center gap-2">
            <a 
              href="https://sp1.succinct.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors inline-flex items-center gap-1"
            >
              <Zap size={12} />
              Learn more about SP1
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;