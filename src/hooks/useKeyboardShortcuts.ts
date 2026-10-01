import { useEffect } from 'react';
import { useAppStore } from '../store';

export function useKeyboardShortcuts() {
  const {
    currentView,
    setCurrentView,
    selectedTopicId,
    setSelectedTopicId,
    progressMap,
    setTopicStatus,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isQuickNotesOpen,
    setQuickNotesOpen,
  } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in input or textarea
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Handle Escape anywhere
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setCommandPaletteOpen(false);
          return;
        }
        if (isQuickNotesOpen) {
          setQuickNotesOpen(false);
          return;
        }
        if (selectedTopicId) {
          setSelectedTopicId(null);
          return;
        }
      }

      // Handle Cmd/Ctrl+K or Slash for Search / Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
        return;
      }

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Ignore remaining shortcuts if user is typing text
      if (isInput) return;

      // Space -> Toggle completion of selected topic
      if (e.code === 'Space' && selectedTopicId) {
        e.preventDefault();
        const current = progressMap[selectedTopicId]?.status;
        const next = current === 'interview_ready' || current === 'practiced' ? 'not_started' : 'interview_ready';
        setTopicStatus(selectedTopicId, next);
        return;
      }

      // D -> Dashboard
      if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setCurrentView('dashboard');
        return;
      }

      // T -> Today
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setCurrentView('daily');
        return;
      }

      // R -> Revision
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setCurrentView('revision');
        return;
      }

      // I -> Interview Mode
      if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setCurrentView('interview');
        return;
      }

      // N -> Notes
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setQuickNotesOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentView,
    setCurrentView,
    selectedTopicId,
    setSelectedTopicId,
    progressMap,
    setTopicStatus,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isQuickNotesOpen,
    setQuickNotesOpen,
  ]);
}
