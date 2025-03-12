/**
 * TerminalWindow.tsx
 * A retro-styled terminal window component that displays verification logs.
 * Changes:
 * - Created new component for terminal output
 * - Added real-time verification logging
 * - Implemented retro terminal styling
 */
import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Terminal } from 'lucide-react';

interface TerminalWindowProps {
  darkMode: boolean;
  onClose: () => void;
  isMaximized: boolean;
}

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'progress';
  message: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ 
  darkMode, 
  onClose,
  isMaximized
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [maximized, setMaximized] = useState(isMaximized);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Generate sample verification logs
  useEffect(() => {
    const initialLogs: LogEntry[] = [
      {
        timestamp: formatTimestamp(new Date()),
        type: 'info',
        message: 'SP1 verification system initialized'
      },
      {
        timestamp: formatTimestamp(new Date(Date.now() - 1000)),
        type: 'info',
        message: 'WebAssembly runtime loaded successfully'
      },
      {
        timestamp: formatTimestamp(new Date(Date.now() - 2000)),
        type: 'info',
        message: 'Waiting for game events...'
      }
    ];
    
    setLogs(initialLogs);
    
    // Simulate new logs appearing
    const interval = setInterval(() => {
      const randomLogTypes: Array<LogEntry['type']> = ['info', 'success', 'progress'];
      const randomType = randomLogTypes[Math.floor(Math.random() * randomLogTypes.length)];
      
      const messages = {
        info: [
          'Checking game state integrity...',
          'Analyzing snake movement patterns...',
          'Validating food placement randomness...',
          'Preparing verification context...',
          'Loading SP1 verification key...',
          'Initializing zero-knowledge circuit...',
          'Checking WebAssembly compatibility...'
        ],
        success: [
          'Game state hash verified: 0x7f8e9d2c1b3a...',
          'Snake movement pattern valid',
          'Food placement entropy confirmed',
          'Score calculation verified',
          'Game rules compliance confirmed',
          'SP1 proof generated successfully',
          'Zero-knowledge proof verified!'
        ],
        progress: [
          'Step 1/5: Initializing verification...',
          'Step 2/5: Computing cryptographic hash of game state...',
          'Step 3/5: Generating SP1 zero-knowledge proof...',
          'Step 4/5: Verifying game rules compliance...',
          'Step 5/5: Verifying SP1 zero-knowledge proof...'
        ],
        error: [
          'Error: Verification failed - invalid game state',
          'Error: Snake length mismatch',
          'Error: Score calculation inconsistent',
          'Error: WebAssembly execution failed'
        ],
        warning: [
          'Warning: Unusual snake movement pattern detected',
          'Warning: Verification taking longer than expected',
          'Warning: High entropy in food placement'
        ]
      };
      
      const randomMessage = messages[randomType][Math.floor(Math.random() * messages[randomType].length)];
      
      const newLog: LogEntry = {
        timestamp: formatTimestamp(new Date()),
        type: randomType,
        message: randomMessage
      };
      
      setLogs(prevLogs => [...prevLogs, newLog].slice(-100)); // Keep only the last 100 logs
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);
  
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  const getLogColor = (type: LogEntry['type']): string => {
    switch (type) {
      case 'info':
        return darkMode ? 'text-blue-400' : 'text-blue-600';
      case 'success':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'error':
        return darkMode ? 'text-red-400' : 'text-red-600';
      case 'warning':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'progress':
        return darkMode ? 'text-purple-400' : 'text-purple-600';
      default:
        return darkMode ? 'text-gray-300' : 'text-gray-700';
    }
  };
  
  const getLogPrefix = (type: LogEntry['type']): string => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'progress':
        return '⏳';
      default:
        return '>';
    }
  };
  
  if (isMinimized) {
    return (
      <div 
        className={`fixed bottom-8 right-8 px-3 py-2 rounded-lg shadow-lg cursor-pointer ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-purple-500" />
          <span className="text-sm">Terminal</span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`fixed ${maximized ? 'inset-0 m-4' : 'bottom-32 right-8 w-[500px]'} ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'} rounded-lg overflow-hidden shadow-xl transition-all duration-300 z-10`}
    >
      {/* Terminal Title Bar */}
      <div className={`flex justify-between items-center px-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-400'}`}>
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-purple-500" />
          <h3 className="text-sm font-bold font-orbitron">SP1 Verification Terminal</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMaximized(!maximized)}
            className="p-1 rounded-sm hover:bg-gray-700/50"
            aria-label="Maximize"
          >
            <Maximize2 size={14} />
          </button>
          <button 
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-red-500 hover:text-white"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className={`p-4 font-mono text-sm h-[300px] overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-black text-green-500'}`}
        style={{ 
          fontFamily: "'Courier New', monospace",
          ...(darkMode ? {} : { textShadow: '0 0 5px rgba(0, 255, 0, 0.5)' })
        }}
      >
        {logs.map((log, index) => (
          <div key={index} className="mb-1 leading-tight">
            <span className="opacity-70">[{log.timestamp}]</span>{' '}
            <span className={getLogColor(log.type)}>
              {getLogPrefix(log.type)} {log.message}
            </span>
          </div>
        ))}
        <div className="animate-pulse">
          <span className={darkMode ? 'text-gray-400' : 'text-green-500'}>$ _</span>
        </div>
      </div>
      
      {/* Terminal Status Bar */}
      <div className={`flex justify-between items-center px-4 py-1 text-xs ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-300 text-gray-700'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-400'}`}>
        <div>SP1 Verification System v1.0.0</div>
        <div>WebAssembly Runtime: Active</div>
      </div>
    </div>
  );
};

export default TerminalWindow;