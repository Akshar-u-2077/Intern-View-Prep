import React from 'react';
import { Terminal, Shield, RefreshCw, Search, BookOpen, Share2, Sparkles, User, Cloud } from 'lucide-react';
import { useAppStore } from '../../store';

export const Header: React.FC = () => {
  const {
    syncState,
    lastSavedMessage,
    profile,
    setCommandPaletteOpen,
    setQuickNotesOpen,
    setCurrentView,
    currentView,
  } = useAppStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-term-bg/95 backdrop-blur-md border-b border-term-panelBorder px-4 py-2.5 flex items-center justify-between">
      {/* Brand & Terminal Identifier */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center space-x-2 text-left group focus:outline-none"
        >
          <div className="h-8 w-8 rounded bg-term-panel border border-term-panelBorder flex items-center justify-center text-term-green group-hover:border-term-green/50 group-hover:shadow-glow-green transition-all">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-sm text-term-text group-hover:text-term-green transition-colors">
                AKXR <span className="text-term-green">//</span> PREP-TERMINAL
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-term-green/10 text-term-green border border-term-green/30">
                v2.6 OS
              </span>
            </div>
            <div className="text-[10px] text-term-muted flex items-center space-x-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-term-green animate-pulse"></span>
              <span>SYS_READY</span>
              <span className="hidden sm:inline text-term-darkMuted">•</span>
              <span className="hidden sm:inline text-term-cyan font-mono">@{profile.username}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Middle Status / Saved Flash Notice */}
      <div className="hidden lg:flex items-center space-x-3">
        {lastSavedMessage ? (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-term-green/10 text-term-green border border-term-green/40 text-xs font-mono animate-bounce">
            <span className="w-1.5 h-1.5 rounded-full bg-term-green"></span>
            <span>{lastSavedMessage}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs font-mono text-term-muted">
            <span className="text-term-darkMuted">$</span>
            <span className="text-term-muted">prep --status</span>
            <span className="text-term-cyan">ACTIVE_SESSION</span>
          </div>
        )}
      </div>

      {/* Right Controls & Status */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Sync Indicator Pill */}
        <div className="hidden sm:flex items-center">
          {syncState === 'synced' && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-term-panel border border-term-panelBorder text-term-green text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-term-green"></span>
              <span>● SYNCED</span>
            </div>
          )}
          {syncState === 'syncing' && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-term-panel border border-term-panelBorder text-term-cyan text-xs font-mono">
              <RefreshCw className="w-3 h-3 animate-spin text-term-cyan" />
              <span>◌ SYNCING...</span>
            </div>
          )}
          {(syncState === 'saved_locally' || syncState === 'offline') && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-term-panel border border-term-panelBorder text-term-amber text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-term-amber"></span>
              <span>LOCAL_CACHE</span>
            </div>
          )}
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-term-panel hover:bg-term-panelBorder/70 border border-term-panelBorder text-xs text-term-text hover:text-term-green transition-all"
          title="Open Command Palette (Ctrl+K or /)"
        >
          <Search className="w-3.5 h-3.5 text-term-green" />
          <span className="hidden sm:inline font-mono">CMD</span>
          <kbd className="hidden md:inline-block px-1 py-0.2 bg-term-bg border border-term-panelBorder rounded text-[10px] text-term-muted">
            Ctrl+K
          </kbd>
        </button>

        {/* Quick Notes Toggle */}
        <button
          onClick={() => setQuickNotesOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-term-panel hover:bg-term-panelBorder/70 border border-term-panelBorder text-xs text-term-text hover:text-term-cyan transition-all"
          title="Quick Scratchpad Notes (N)"
        >
          <BookOpen className="w-3.5 h-3.5 text-term-cyan" />
          <span className="hidden sm:inline font-mono">NOTES</span>
          <kbd className="hidden md:inline-block px-1 py-0.2 bg-term-bg border border-term-panelBorder rounded text-[10px] text-term-muted">
            N
          </kbd>
        </button>

        {/* Public Share Trigger */}
        <button
          onClick={() => setCurrentView('share')}
          className={`px-2.5 py-1.5 rounded text-xs font-mono border transition-all flex items-center space-x-1.5 ${
            currentView === 'share'
              ? 'bg-term-purple/20 text-term-purple border-term-purple/40 shadow-glow-purple'
              : 'bg-term-panel hover:bg-term-panelBorder/70 text-term-text border-term-panelBorder hover:text-term-purple'
          }`}
          title="Public Read-Only Share Link"
        >
          <Share2 className="w-3.5 h-3.5 text-term-purple" />
          <span className="hidden md:inline">SHARE</span>
        </button>

        {/* Settings & Profile Button */}
        <button
          onClick={() => setCurrentView('settings')}
          className={`p-1.5 rounded text-xs font-mono border transition-all ${
            currentView === 'settings'
              ? 'bg-term-green/20 text-term-green border-term-green/50'
              : 'bg-term-panel hover:bg-term-panelBorder/70 text-term-muted hover:text-term-text border-term-panelBorder'
          }`}
          title="Settings & Configuration"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
