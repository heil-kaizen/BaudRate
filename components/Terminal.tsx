import React, { useState, useEffect, useRef } from 'react';
import { streamGeminiResponse } from '../services/geminiService';
import { ThemeColor, THEMES } from '../utils/constants';

interface TerminalProps {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  isPowered: boolean;
}

interface HistoryItem {
  type: 'input' | 'output' | 'error';
  content: string;
}

const Terminal: React.FC<TerminalProps> = ({ theme, setTheme, isPowered }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTheme = THEMES[theme];

  // Initial boot sequence with animation delay
  useEffect(() => {
    if (isPowered) {
      setHistory([]);
      
      const timeouts: ReturnType<typeof setTimeout>[] = [];
      // Delay text appearance to allow 'turn-on' animation to play out slightly
      const bootDelay = 1500; 

      const startTimer = setTimeout(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const dateStr = now.toLocaleDateString('en-US').toUpperCase();
        
        // Dynamic boot sequence
        const bootSequence = [
          "BAUDRATE-OS v3.1.4 (c) 1989-2025",
          `SYSTEM TIME: ${timeStr} // DATE: ${dateStr}`,
          `TERMINAL ID: T-${Math.floor(Math.random() * 9000) + 1000}-X`,
          `MEMORY CHECK: ${Math.floor(Math.random() * 32000) + 32000}KB OK`,
          "Initializing memory... OK",
          "Loading holographic projection... OK",
          "Connecting to neural net... LINK ESTABLISHED",
          "",
          "Welcome to the BaudRate Terminal.",
          "Type 'help' to see available commands.",
          ""
        ];

        let delay = 0;
        bootSequence.forEach((line) => {
          const t = setTimeout(() => {
            setHistory((prev) => [...prev, { type: 'output', content: line }]);
          }, delay);
          timeouts.push(t);
          // Variable delay for realistic typing/loading feel
          delay += 100 + Math.random() * 150;
        });
      }, bootDelay);

      timeouts.push(startTimer);

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [isPowered]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, streamingContent, input]);

  // Focus input on click
  const handleContainerClick = () => {
    if (!isProcessing) {
      inputRef.current?.focus();
    }
  };

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add to display history
    setHistory((prev) => [...prev, { type: 'input', content: trimmedCmd }]);
    // Add to memory history for up/down arrows
    setCommandHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
    setInput('');

    const args = trimmedCmd.split(' ');
    const mainCommand = args[0].toLowerCase();
    const commandArgs = args.slice(1).join(' ');

    switch (mainCommand) {
      case 'help':
        setHistory((prev) => [
          ...prev,
          { type: 'output', content: 'AVAILABLE COMMANDS:' },
          { type: 'output', content: '  ask <query>  - Query the Neural Net (Gemini AI)' },
          { type: 'output', content: '  theme <name> - Change color (amber, green, cyan, white)' },
          { type: 'output', content: '  clear        - Clear the terminal screen' },
          { type: 'output', content: '  date         - Display system date/time' },
          { type: 'output', content: '  whoami       - Display current user' },
          { type: 'output', content: '  about        - System information' },
        ]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'date':
        setHistory((prev) => [
          ...prev,
          { type: 'output', content: new Date().toString() },
        ]);
        break;

      case 'whoami':
        setHistory((prev) => [
          ...prev,
          { type: 'output', content: 'guest@baudrate-v1' },
        ]);
        break;
        
      case 'about':
        setHistory((prev) => [
          ...prev,
          { type: 'output', content: 'Developed by BaudRate Systems.' },
          { type: 'output', content: 'Running on React + Tailwind + Gemini Flash.' },
        ]);
        break;

      case 'theme':
        const newTheme = commandArgs.toUpperCase();
        if (newTheme in ThemeColor) {
          setTheme(newTheme as ThemeColor);
          setHistory((prev) => [
            ...prev,
            { type: 'output', content: `Theme changed to ${newTheme}` },
          ]);
        } else {
           setHistory((prev) => [
            ...prev,
            { type: 'error', content: `Unknown theme. Available: ${Object.keys(ThemeColor).join(', ').toLowerCase()}` },
          ]);
        }
        break;

      case 'ask':
        if (!commandArgs) {
          setHistory((prev) => [
            ...prev,
            { type: 'error', content: 'Usage: ask <your question>' },
          ]);
          break;
        }
        setIsProcessing(true);
        setStreamingContent('');
        
        await streamGeminiResponse(
          commandArgs,
          (chunk) => setStreamingContent((prev) => prev + chunk),
          () => {
            setIsProcessing(false);
            setHistory((prev) => [
              ...prev,
              { type: 'output', content: streamingContent + (streamingContent.endsWith('\n') ? '' : '\n') } 
            ]);
          },
          (err) => {
             setHistory((prev) => [...prev, { type: 'error', content: err }]);
          }
        );
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { type: 'error', content: `Command not found: ${mainCommand}` },
        ]);
    }
  };

  // Commit streaming content to history when processing finishes
  const prevProcessing = useRef(isProcessing);
  useEffect(() => {
    if (prevProcessing.current && !isProcessing && streamingContent) {
      setHistory(prev => [...prev, { type: 'output', content: streamingContent }]);
      setStreamingContent('');
    }
    prevProcessing.current = isProcessing;
  }, [isProcessing, streamingContent]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  if (!isPowered) return null;

  return (
    <div 
      className={`h-full w-full p-6 sm:p-10 overflow-auto font-bold text-2xl sm:text-3xl leading-relaxed outline-none ${activeTheme.text} ${activeTheme.selection} crt-flicker crt-turn-on`}
      onClick={handleContainerClick}
      ref={scrollRef}
    >
      {/* History */}
      {history.map((item, idx) => (
        <div key={idx} className="mb-1 break-words whitespace-pre-wrap">
          {item.type === 'input' && (
            <span className="mr-3 opacity-80">{'>'}</span>
          )}
          <span className={item.type === 'error' ? 'text-red-500 text-shadow-none' : ''}>
            {item.content}
          </span>
        </div>
      ))}

      {/* Streaming Output */}
      {isProcessing && (
        <div className="mb-1 break-words whitespace-pre-wrap">
          <span className={activeTheme.glow}>{streamingContent}</span>
          <span className={`inline-block w-3 h-7 sm:w-4 sm:h-9 align-middle ml-1 ${activeTheme.cursor} crt-cursor`}></span>
        </div>
      )}

      {/* Input Line */}
      {!isProcessing && (
        <div className="flex items-start">
          <span className="mr-3 opacity-80 mt-[2px]">{'>'}</span>
          <div className="relative flex-1 group">
            <span className={`${activeTheme.text} uppercase whitespace-pre-wrap break-all outline-none`}>
              {input}
              <span className={`inline-block w-3 h-7 sm:w-4 sm:h-9 align-text-bottom ${activeTheme.cursor} crt-cursor ml-[2px]`}></span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Terminal;