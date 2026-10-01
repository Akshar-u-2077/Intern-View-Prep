import React, { useState, useRef } from 'react';
import {
  Settings,
  User,
  Palette,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Sun,
  Moon,
  Zap,
  Bell,
  Shield,
  Save,
  RefreshCcw,
  Flame,
  Eye,
  HardDrive
} from 'lucide-react';
import { useAppStore } from '../../store';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    exportBackupData,
    importBackupData,
    resetAllProgress,
  } = useAppStore();

  const [confirmReset, setConfirmReset] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export
  const handleExport = () => {
    const data = exportBackupData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `akxr-prep-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await importBackupData(text);
      setImportResult(result ? '✓ IMPORT SUCCESSFUL — All data reconstructed.' : '✕ IMPORT FAILED — Invalid backup schema.');
    } catch (err) {
      setImportResult('✕ IMPORT FAILED — Unable to parse file.');
    }

    setTimeout(() => setImportResult(null), 5000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto pb-24 md:pb-12 font-mono">
      {/* Top Banner */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 shadow-panel">
        <div className="flex items-center space-x-3 border-b border-term-panelBorder pb-4">
          <div className="p-2.5 rounded bg-term-green/10 border border-term-green/30 text-term-green">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-term-muted font-bold tracking-wider">SYS_CONFIG //</div>
            <h1 className="text-xl font-bold text-term-text">TERMINAL CONFIGURATION</h1>
            <p className="text-xs text-term-muted mt-0.5">Customize account, theme, backup, and data persistence</p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 space-y-4">
        <div className="text-xs font-bold text-term-text flex items-center space-x-2">
          <User className="w-4 h-4 text-term-cyan" />
          <span>USER IDENTITY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-term-muted text-[11px]">Display Name</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => updateProfile({ displayName: e.target.value })}
              className="w-full px-3 py-2 bg-term-bg rounded border border-term-panelBorder text-term-text focus:outline-none focus:border-term-green/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-term-muted text-[11px]">Username (for share links)</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => updateProfile({ username: e.target.value, shareSlug: e.target.value })}
              className="w-full px-3 py-2 bg-term-bg rounded border border-term-panelBorder text-term-text focus:outline-none focus:border-term-green/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-term-muted text-[11px]">Daily Target (topics/day)</label>
            <input
              type="number"
              min={1}
              max={20}
              value={profile.dailyTarget}
              onChange={(e) => updateProfile({ dailyTarget: parseInt(e.target.value) || 3 })}
              className="w-full px-3 py-2 bg-term-bg rounded border border-term-panelBorder text-term-text focus:outline-none focus:border-term-green/50"
            />
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 space-y-4">
        <div className="text-xs font-bold text-term-text flex items-center space-x-2">
          <Palette className="w-4 h-4 text-term-purple" />
          <span>VISUAL THEME & ACCESSIBILITY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-term-muted text-[11px]">Terminal Intensity</label>
            <div className="flex items-center space-x-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => updateProfile({ terminalIntensity: level })}
                  className={`px-3 py-1.5 rounded border transition-all ${
                    profile.terminalIntensity === level
                      ? 'bg-term-green/20 text-term-green border-term-green/50 font-bold'
                      : 'bg-term-bg text-term-muted border-term-panelBorder hover:text-term-text'
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-term-muted text-[11px]">Reduced Motion</label>
            <button
              onClick={() => updateProfile({ reducedMotion: !profile.reducedMotion })}
              className={`px-4 py-1.5 rounded border transition-all ${
                profile.reducedMotion
                  ? 'bg-term-amber/20 text-term-amber border-term-amber/50 font-bold'
                  : 'bg-term-bg text-term-muted border-term-panelBorder hover:text-term-text'
              }`}
            >
              {profile.reducedMotion ? '● REDUCED MOTION ON' : '○ ANIMATIONS ENABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Backup & Recovery Section */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 space-y-4">
        <div className="text-xs font-bold text-term-text flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-term-amber" />
          <span>BACKUP AND DATA RECOVERY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="p-4 rounded bg-term-card hover:bg-term-panelBorder/70 border border-term-panelBorder transition-all text-left space-y-1"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-term-green">
              <Download className="w-4 h-4" />
              <span>EXPORT MY DATA</span>
            </div>
            <div className="text-[11px] text-term-muted">
              Download JSON containing progress, notes, statuses, revision data, and settings
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded bg-term-card hover:bg-term-panelBorder/70 border border-term-panelBorder transition-all text-left space-y-1"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-term-cyan">
              <Upload className="w-4 h-4" />
              <span>IMPORT BACKUP</span>
            </div>
            <div className="text-[11px] text-term-muted">
              Restore from a previously exported JSON backup file
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {importResult && (
          <div className={`p-3 rounded text-xs font-mono ${
            importResult.includes('SUCCESSFUL')
              ? 'bg-term-green/10 text-term-green border border-term-green/30'
              : 'bg-term-red/10 text-term-red border border-term-red/30'
          }`}>
            {importResult}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset */}
      <div className="border border-term-red/30 rounded-lg bg-term-panel p-4 md:p-6 space-y-4">
        <div className="text-xs font-bold text-term-red flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>DANGER ZONE</span>
        </div>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 rounded bg-term-red/10 hover:bg-term-red/20 border border-term-red/40 text-term-red text-xs font-bold transition-all"
          >
            Reset All Progress
          </button>
        ) : (
          <div className="p-4 rounded bg-term-red/5 border border-term-red/20 space-y-3">
            <div className="text-sm font-bold text-term-red">
              ⚠ WARNING — This will reset your progress.
            </div>
            <div className="text-xs text-term-muted">
              Your notes and account will not be deleted.
              This action cannot be undone unless you have a backup.
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded bg-term-card border border-term-panelBorder text-term-muted text-xs hover:text-term-text"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  await resetAllProgress();
                  setConfirmReset(false);
                }}
                className="px-4 py-2 rounded bg-term-red text-term-bg font-bold text-xs hover:bg-term-redDim transition-colors"
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
