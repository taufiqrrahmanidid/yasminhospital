import React from 'react';
import type { PendaftaranStatus, PendaftaranSource } from '../types';
import { STATUS_LABEL, SOURCE_LABEL } from '../types';

interface Props {
  status: PendaftaranStatus | '';
  source: PendaftaranSource | '';
  onStatusChange: (s: PendaftaranStatus | '') => void;
  onSourceChange: (s: PendaftaranSource | '') => void;
  onRefresh: () => void;
}

export default function FilterBar({ status, source, onStatusChange, onSourceChange, onRefresh }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as PendaftaranStatus | '')}
        className="rounded-lg border border-divider bg-white px-3 py-1.5 text-sm text-body-text outline-none focus:border-yasmin-green"
      >
        <option value="">Semua status</option>
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={source}
        onChange={(e) => onSourceChange(e.target.value as PendaftaranSource | '')}
        className="rounded-lg border border-divider bg-white px-3 py-1.5 text-sm text-body-text outline-none focus:border-yasmin-green"
      >
        <option value="">Semua sumber</option>
        {Object.entries(SOURCE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <button
        onClick={onRefresh}
        className="ml-auto rounded-lg border border-divider px-3 py-1.5 text-sm text-body-text hover:bg-soft-mint hover:text-deep-teal hover:border-yasmin-green/40 transition-colors"
      >
        Segarkan
      </button>
    </div>
  );
}
