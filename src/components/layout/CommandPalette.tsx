import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, ArrowRight, BookOpen, Layers, RotateCcw, Sparkles, X, Check } from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem } from '../../types/curriculum';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentView,
    setSelectedTopicId,
    setSelectedSprintDay,
    setSelectedSubject,
    setTopicStatus,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten all topics for rapid querying
  const allTopics: TopicItem[] = React.useMemo(() => {
    const list: TopicItem[] = [];
    curriculumData.sprints.forEach((s) => {
      s.days.forEach((d) => {
        d.topics.forEach((t) => {
          list.push(t as TopicItem);
        });
      });
    });
    return list;
  }, []);

  // Filter commands and topics based on input
  const results = React.useMemo(() => {
    const q = input.trim().toLowerCase();
    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'COMMAND' | 'TOPIC' | 'NAV';
      action: () => void;
    }> = [];

    // Commands
    const commands = [
      { id: 'cmd_today', title: 'Open Today\'s Target Queue', subtitle: 'View your scheduled target topics for today', category: 'COMMAND' as const, action: () => { setCurrentView('daily'); setCommandPaletteOpen(false); } },
      { id: 'cmd_revision', title: 'Open Spaced Repetition Queue', subtitle: 'Review overdue and pending topics', category: 'COMMAND' as const, action: () => { setCurrentView('revision'); setCommandPaletteOpen(false); } },
      { id: 'cmd_interview', title: 'Launch Mock Interview Simulator', subtitle: 'Test recall on completed topics with confidence scoring', category: 'COMMAND' as const, action: () => { setCurrentView('interview'); setCommandPaletteOpen(false); } },
      { id: 'cmd_analytics', title: 'Open Analytics & Streaks', subtitle: 'Subject breakdown and sprint completion charts', category: 'COMMAND' as const, action: () => { setCurrentView('analytics'); setCommandPaletteOpen(false); } },
      { id: 'cmd_settings', title: 'Open Settings & Backup', subtitle: 'Configure Supabase, export/import JSON, adjust theme', category: 'COMMAND' as const, action: () => { setCurrentView('settings'); setCommandPaletteOpen(false); } },
      { id: 'cmd_share', title: 'View Public Read-Only Share Link', subtitle: 'Share your progress with friends or recruiters', category: 'COMMAND' as const, action: () => { setCurrentView('share'); setCommandPaletteOpen(false); } },
    ];

    if (!q) {
      return commands;
    }

    // Match commands
    commands.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)) {
        items.push(c);
      }
    });

    // Match topics
    const matchedTopics = allTopics.filter((t) => 
      t.title.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    ).slice(0, 20);

    matchedTopics.forEach((t) => {
      items.push({
        id: t.id,
        title: t.title,
        subtitle: `Sprint ${t.sprintNumber} • Day ${t.dayNumber} • ${t.subject} • ${t.duration}`,
        category: 'TOPIC',
        action: () => {
          setSelectedSprintDay(t.sprintNumber, t.dayNumber);
          setSelectedTopicId(t.id);
          setCurrentView('sprints');
          setCommandPaletteOpen(false);
        }
      });
    });

    return items;
  }, [input, allTopics, setCurrentView, setSelectedTopicId, setSelectedSprintDay, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setInput('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Handle Keyboard Nav within Command Palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-term-panel border border-term-panelBorder rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Bar */}
        <div className="bg-term-panelHeader px-4 py-2 border-b border-term-panelBorder flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-term-muted">
            <Terminal className="w-3.5 h-3.5 text-term-green" />
            <span className="text-term-green font-semibold">TERMINAL_EXEC //</span>
            <span>COMMAND PALETTE</span>
          </div>
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-term-muted hover:text-term-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Field */}
        <div className="p-3 border-b border-term-panelBorder flex items-center space-x-3 bg-term-card">
          <span className="text-term-green font-mono font-bold">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search 712 topics (e.g. 'LRU Cache', 'TCP', 'Deadlock')..."
            className="w-full bg-transparent text-sm font-mono text-term-text placeholder:text-term-darkMuted focus:outline-none"
          />
          {input && (
            <button
              onClick={() => setInput('')}
              className="text-xs font-mono text-term-muted hover:text-term-text"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-term-panelBorder/30">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-term-muted">
              No topics or commands found matching &quot;{input}&quot;
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded cursor-pointer transition-all flex items-center justify-between text-xs font-mono ${
                    isSelected
                      ? 'bg-term-green/15 text-term-green border border-term-green/30'
                      : 'text-term-text hover:bg-term-card'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                        item.category === 'COMMAND'
                          ? 'bg-term-purple/20 text-term-purple border border-term-purple/30'
                          : 'bg-term-cyan/15 text-term-cyan border border-term-cyan/30'
                      }`}
                    >
                      {item.category}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold truncate">{item.title}</div>
                      <div className="text-[11px] text-term-muted truncate">{item.subtitle}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-3.5 h-3.5 text-term-green shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-term-panelHeader/70 border-t border-term-panelBorder flex items-center justify-between text-[10px] font-mono text-term-muted">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-term-green">{results.length} items</span>
        </div>
      </div>
    </div>
  );
};
