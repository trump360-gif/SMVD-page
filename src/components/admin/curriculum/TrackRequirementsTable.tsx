'use client';

import { useState, useEffect } from 'react';
import type { TrackData } from '@/lib/validation/curriculum';

// ============================================================
// InlineEditCell - click to edit text
// ============================================================

interface InlineEditCellProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

function InlineEditCell({ value, onChange, multiline, placeholder }: InlineEditCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = () => {
    onChange(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-colors min-h-[24px] text-sm text-gray-800 whitespace-pre-wrap"
        title="Click to edit"
      >
        {value || (
          <span className="text-gray-400 italic">{placeholder || 'Click to edit'}</span>
        )}
      </div>
    );
  }

  if (multiline) {
    return (
      <div className="space-y-1">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
          rows={4}
          className="w-full px-2 py-1 text-sm border border-blue-400 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
          placeholder={placeholder}
        />
        <div className="flex gap-1 justify-end">
          <button
            onClick={handleCancel}
            className="px-2 py-0.5 text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
      }}
      autoFocus
      className="w-full px-2 py-1 text-sm border border-blue-400 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      placeholder={placeholder}
    />
  );
}

// ============================================================
// TrackRequirementsTable
// ============================================================

const TRACK_COLORS = ['#489bffff', '#ffcc54ff', '#ff5f5aff', '#a24affff'];

interface TrackRequirementsTableProps {
  tracks: TrackData[];
  onSave: (tracks: TrackData[]) => void;
  isSaving?: boolean;
}

export default function TrackRequirementsTable({
  tracks: initialTracks,
  onSave,
  isSaving,
}: TrackRequirementsTableProps) {
  const [tracks, setTracks] = useState<TrackData[]>(initialTracks);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTracks(initialTracks);
    setHasChanges(false);
  }, [initialTracks]);

  const updateTrack = (index: number, field: keyof TrackData, value: string) => {
    setTracks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(tracks);
    setHasChanges(false);
  };

  const handleReset = () => {
    setTracks(initialTracks);
    setHasChanges(false);
  };

  return (
    <div className="space-y-4">
      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Click on any cell to edit inline. Courses field supports line breaks (use Enter in textarea).
          The <code className="bg-blue-100 px-1 rounded">\\n</code> in data will be displayed as actual line breaks.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-1/5">
                Track Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-2/5">
                Courses
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-1/4">
                Requirements
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-[100px]">
                Credits
              </th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => {
              const trackColor = TRACK_COLORS[index % TRACK_COLORS.length];
              // Display: convert \\n to real newlines for textarea editing
              const displayCourses = track.courses.replace(/\\n/g, '\n');

              return (
                <tr
                  key={track.name}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Track Name with Color */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: trackColor }}
                      />
                      <InlineEditCell
                        value={track.track}
                        onChange={(val) => updateTrack(index, 'track', val)}
                        placeholder="Track name"
                      />
                    </div>
                  </td>

                  {/* Courses (multiline) */}
                  <td className="px-4 py-3">
                    <InlineEditCell
                      value={displayCourses}
                      onChange={(val) => {
                        // Convert real newlines back to \\n for storage
                        const stored = val.replace(/\n/g, '\\n');
                        updateTrack(index, 'courses', stored);
                      }}
                      multiline
                      placeholder="Course list (one per line)"
                    />
                  </td>

                  {/* Requirements */}
                  <td className="px-4 py-3">
                    <InlineEditCell
                      value={track.requirements}
                      onChange={(val) => updateTrack(index, 'requirements', val)}
                      placeholder="Requirements"
                    />
                  </td>

                  {/* Credits */}
                  <td className="px-4 py-3">
                    <InlineEditCell
                      value={track.credits}
                      onChange={(val) => updateTrack(index, 'credits', val)}
                      placeholder="Credits"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {tracks.length} tracks
          {hasChanges && (
            <span className="ml-2 text-amber-600 font-medium">
              (unsaved changes)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          >
            {isSaving ? 'Saving...' : 'Save Tracks'}
          </button>
        </div>
      </div>
    </div>
  );
}
