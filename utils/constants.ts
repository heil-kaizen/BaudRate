export enum ThemeColor {
  AMBER = 'AMBER',
  GREEN = 'GREEN',
  CYAN = 'CYAN',
  WHITE = 'WHITE',
}

export const THEMES = {
  [ThemeColor.AMBER]: {
    hex: '#ffb000',
    text: 'text-[#ffb000] [text-shadow:0_0_4px_rgba(255,176,0,0.6),0_0_12px_rgba(255,176,0,0.4)]',
    glow: 'drop-shadow-[0_0_15px_rgba(255,176,0,0.6)] drop-shadow-[0_0_35px_rgba(255,176,0,0.4)]',
    border: 'border-[#ffb000]',
    bg: 'bg-[#ffb000]',
    selection: 'selection:bg-[#ffb000] selection:text-black',
    cursor: 'bg-[#ffb000] shadow-[0_0_10px_#ffb000]',
  },
  [ThemeColor.GREEN]: {
    hex: '#33ff00',
    text: 'text-[#33ff00] [text-shadow:0_0_4px_rgba(51,255,0,0.6),0_0_12px_rgba(51,255,0,0.4)]',
    glow: 'drop-shadow-[0_0_15px_rgba(51,255,0,0.6)] drop-shadow-[0_0_35px_rgba(51,255,0,0.4)]',
    border: 'border-[#33ff00]',
    bg: 'bg-[#33ff00]',
    selection: 'selection:bg-[#33ff00] selection:text-black',
    cursor: 'bg-[#33ff00] shadow-[0_0_10px_#33ff00]',
  },
  [ThemeColor.CYAN]: {
    hex: '#00ffff',
    text: 'text-[#00ffff] [text-shadow:0_0_4px_rgba(0,255,255,0.6),0_0_12px_rgba(0,255,255,0.4)]',
    glow: 'drop-shadow-[0_0_15px_rgba(0,255,255,0.6)] drop-shadow-[0_0_35px_rgba(0,255,255,0.4)]',
    border: 'border-[#00ffff]',
    bg: 'bg-[#00ffff]',
    selection: 'selection:bg-[#00ffff] selection:text-black',
    cursor: 'bg-[#00ffff] shadow-[0_0_10px_#00ffff]',
  },
  [ThemeColor.WHITE]: {
    hex: '#ffffff',
    text: 'text-[#ffffff] [text-shadow:0_0_4px_rgba(255,255,255,0.6),0_0_12px_rgba(255,255,255,0.4)]',
    glow: 'drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]',
    border: 'border-[#ffffff]',
    bg: 'bg-[#ffffff]',
    selection: 'selection:bg-[#ffffff] selection:text-black',
    cursor: 'bg-[#ffffff] shadow-[0_0_10px_#ffffff]',
  },
};

export const WELCOME_MESSAGE = [
  "RETRO-OS v3.1.4 (c) 1989-2025",
  "Initializing memory... OK",
  "Loading holographic projection... OK",
  "Connecting to neural net... LINK ESTABLISHED",
  "",
  "Welcome to the RetroGen Terminal.",
  "Type 'help' to see available commands.",
  ""
];
