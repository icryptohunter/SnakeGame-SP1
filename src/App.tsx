/**
 * App.tsx
 * Main application component that renders the Snake Game and handles routing.
 * Changes:
 * - Fixed JSX structure by wrapping adjacent elements in a parent div
 * - Updated footer text color to white
 * - Added background image
 * - Replaced Zap icon with Succinct icon
 * - Changed @icryptohunter link color to black
 */
import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, X, Moon, Sun, Info, ArrowLeft, Disc, Zap } from 'lucide-react';
import Game from './components/Game';
import About from './components/About';
import TerminalWindow from './components/TerminalWindow';
import TextEditor from './components/TextEditor';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'game' | 'about'>('game');
  const [showTerminal, setShowTerminal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMaximized, setIsMaximized] = useState(false);
  const [showGameWindow, setShowGameWindow] = useState(true);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [clickedIcon, setClickedIcon] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };
  
  const closeGameWindow = () => {
    setShowGameWindow(false);
  };
  
  const handleIconClick = (iconName: string) => {
    if (clickedIcon === iconName) {
      if (iconName === 'snake') {
        setClickedIcon('snake-active');
        setTimeout(() => {
          openGameWindow();
          setClickedIcon(null);
        }, 300);
      } else if (iconName === 'about') {
        setClickedIcon('about-active');
        setTimeout(() => {
          openTextEditor();
          setClickedIcon(null);
        }, 300);
      }
    } else {
      setClickedIcon(iconName);
      setTimeout(() => {
        if (clickedIcon === iconName) {
          setClickedIcon(null);
        }
      }, 500);
    }
  };
  
  const openGameWindow = () => {
    setShowGameWindow(true);
    setShowTextEditor(false);
  };
  
  const openTextEditor = () => {
    setShowTextEditor(true);
    setShowGameWindow(false);
  };
  
  const closeTextEditor = () => {
    setShowTextEditor(false);
  };

  const handleMenuAboutClick = () => {
    setShowGameWindow(true);
    setShowTextEditor(false);
    setCurrentView('about');
  };

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}
      style={{
        backgroundImage: 'url(/background-image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className={`flex justify-between items-center px-2 py-1 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Zap size={16} className="text-purple-500 mr-1" />
            <span className="font-orbitron text-sm">Succinct</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className={`px-2 py-0.5 text-sm rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
              File
            </button>
            <button className={`px-2 py-0.5 text-sm rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
              Edit
            </button>
            <button className={`px-2 py-0.5 text-sm rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
              View
            </button>
            <button 
              onClick={toggleTerminal}
              className={`px-2 py-0.5 text-sm rounded ${showTerminal ? (darkMode ? 'bg-gray-700' : 'bg-gray-300') : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}
            >
              Terminal
            </button>
            <button 
              onClick={handleMenuAboutClick}
              className={`px-2 py-0.5 text-sm rounded ${currentView === 'about' ? (darkMode ? 'bg-gray-700' : 'bg-gray-300') : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}
            >
              About
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Disc size={14} className={darkMode ? 'text-green-400' : 'text-green-600'} />
            <span>SP1 Active</span>
          </div>
          <div className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
            {formattedTime}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        {showGameWindow && (
          <div 
            className={`${isMaximized ? 'w-full max-w-none' : 'max-w-4xl mx-auto'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg overflow-hidden shadow-xl transition-all duration-300 ${darkMode ? 'shadow-purple-900/40' : 'shadow-purple-500/20'}`}
          >
            <div className={`flex justify-between items-center px-4 py-2 ${darkMode ? 'bg-purple-800' : 'bg-purple-600'} text-white`}>
              <div className="flex items-center">
                <img src="/succinct-icon-pink.svg" alt="Succinct" className="w-4 h-4 mr-2" />
                <h1 className="text-sm font-bold font-orbitron">Succinct Snake Game {currentView === 'about' ? '- About' : ''}</h1>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleDarkMode}
                  className="p-1 rounded-sm hover:bg-purple-700/50"
                  aria-label="Toggle theme"
                >
                  {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>
                <button 
                  onClick={toggleMaximize}
                  className="p-1 rounded-sm hover:bg-purple-700/50"
                  aria-label="Maximize"
                >
                  <Maximize2 size={14} />
                </button>
                <button 
                  onClick={closeGameWindow}
                  className="p-1 rounded-sm hover:bg-red-500"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
              {currentView === 'game' ? (
                <Game darkMode={darkMode} />
              ) : (
                <div>
                  <button 
                    onClick={() => setCurrentView('game')}
                    className={`mb-4 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    <ArrowLeft size={16} />
                    Back to Game
                  </button>
                  <About darkMode={darkMode} />
                </div>
              )}
            </div>
            
            <div className={`flex justify-between items-center px-4 py-1 text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <div>
                SP1 Zero-Knowledge Proofs Active
              </div>
              <div className="flex items-center gap-2">
                <span>WebAssembly Enabled</span>
                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-600'}`}></div>
              </div>
            </div>
          </div>
        )}
        
        {showTextEditor && (
          <TextEditor 
            darkMode={darkMode} 
            onClose={closeTextEditor}
            isMaximized={isMaximized}
            toggleMaximize={toggleMaximize}
          />
        )}
        
        {showTerminal && (
          <TerminalWindow 
            darkMode={darkMode} 
            onClose={() => setShowTerminal(false)}
            isMaximized={false}
          />
        )}
        
        <div className="fixed top-20 right-8 flex flex-col gap-6">
          <div 
            className={`flex flex-col items-center cursor-pointer group ${clickedIcon === 'snake-active' ? 'animate-bounce' : ''}`}
            onClick={() => handleIconClick('snake')}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md group-hover:shadow-lg transition-shadow ${clickedIcon === 'snake' ? 'bg-purple-200 dark:bg-purple-800' : ''}`}>
              <Zap size={24} className={`text-purple-500 ${clickedIcon === 'snake' ? 'animate-pulse' : ''}`} />
            </div>
            <span className={`mt-1 text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/80 text-gray-900'} ${clickedIcon === 'snake' ? 'bg-purple-200 dark:bg-purple-800' : ''}`}>
              Snake.exe
            </span>
          </div>
          
          <div 
            className={`flex flex-col items-center cursor-pointer group ${clickedIcon === 'about-active' ? 'animate-bounce' : ''}`}
            onClick={() => handleIconClick('about')}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md group-hover:shadow-lg transition-shadow ${clickedIcon === 'about' ? 'bg-blue-200 dark:bg-blue-800' : ''}`}>
              <Info size={24} className={`text-blue-500 ${clickedIcon === 'about' ? 'animate-pulse' : ''}`} />
            </div>
            <span className={`mt-1 text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/80 text-gray-900'} ${clickedIcon === 'about' ? 'bg-blue-200 dark:bg-blue-800' : ''}`}>
              README.txt
            </span>
          </div>
        </div>
      </div>
      
      <footer className="fixed bottom-0 left-0 right-0 py-1 px-4 text-xs text-center font-urbanist border-t border-gray-800/20">
        <p className="text-white">
          Made with ♥ by <a 
            href="https://twitter.com/icryptohunter" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700 transition-colors"
          >@icryptohunter</a>
        </p>
      </footer>
    </div>
  );
}

export default App;