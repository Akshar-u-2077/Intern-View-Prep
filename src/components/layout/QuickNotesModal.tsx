import React, { useState, useEffect } from 'react';
import { BookOpen, X, Save, Lock, Check } from 'lucide-react';
import { useAppStore } from '../../store';

export const QuickNotesModal: React.FC = () => {
  const {
    isQuickNotesOpen,
    setQuickNotesOpen,
    selectedTopicId,
    notesMap,
    saveTopicNote,
  } = useAppStore();

  const [noteContent, setNoteContent] = useState('');
  const [activeTab, setActiveTab] = useState<'topic' | 'scratchpad'>('scratchpad');

  const topicNote = selectedTopicId ? notesMap[selectedTopicId]?.content || '' : '';
  const generalScratchpad = notesMap['__general_scratchpad__']?.content || '';

  useEffect(() => {
    if (activeTab === 'topic' && selectedTopicId) {
      setNoteContent(topicNote);
    } else {
      setNoteContent(generalScratchpad);
    }
  }, [activeTab, selectedTopicId, notesMap]);

  if (!isQuickNotesOpen) return null;

  const handleSave = async () => {
    const targetKey = activeTab === 'topic' && selectedTopicId ? selectedTopicId : '__general_scratchpad__';
    await saveTopicNote(targetKey, noteContent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-term-panel border border-term-panelBorder rounded-lg shadow-2xl overflow-hidden flex flex-col h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-term-panelHeader px-4 py-2.5 border-b border-term-panelBorder flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-term-text">
            <BookOpen className="w-4 h-4 text-term-cyan" />
            <span className="font-semibold text-term-cyan">DEV_SCRATCHPAD //</span>
            <span className="text-term-muted">PRIVATE VAULT</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-term-red/10 text-term-red border border-term-red/30 flex items-center space-x-1">
              <Lock className="w-2.5 h-2.5" />
              <span>ENCRYPTED_LOCAL</span>
            </span>
          </div>
          <button
            onClick={() => setQuickNotesOpen(false)}
            className="text-term-muted hover:text-term-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="bg-term-card px-4 py-2 border-b border-term-panelBorder flex items-center space-x-3 text-xs font-mono">
          <button
            onClick={() => setActiveTab('scratchpad')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'scratchpad'
                ? 'bg-term-cyan/20 text-term-cyan border border-term-cyan/40 font-bold'
                : 'text-term-muted hover:text-term-text'
            }`}
          >
            Global Scratchpad
          </button>
          {selectedTopicId && (
            <button
              onClick={() => setActiveTab('topic')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'topic'
                  ? 'bg-term-cyan/20 text-term-cyan border border-term-cyan/40 font-bold'
                  : 'text-term-muted hover:text-term-text'
              }`}
            >
              Current Topic Notes
            </button>
          )}
        </div>

        {/* Text Area */}
        <div className="flex-1 p-4 bg-term-bg/50 flex flex-col">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your notes, quick interview reminders, tricky edge cases, or cheat sheets here..."
            className="w-full flex-1 bg-transparent resize-none font-mono text-xs text-term-text placeholder:text-term-darkMuted focus:outline-none leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-term-panelHeader border-t border-term-panelBorder flex items-center justify-between text-xs font-mono">
          <span className="text-[11px] text-term-muted">
            Never shared in public read-only links.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuickNotesOpen(false)}
              className="px-3 py-1.5 rounded bg-term-card hover:bg-term-panelBorder text-term-muted text-xs font-mono"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded bg-term-green/20 hover:bg-term-green/30 border border-term-green/50 text-term-green text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-glow-green"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE NOTES</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
