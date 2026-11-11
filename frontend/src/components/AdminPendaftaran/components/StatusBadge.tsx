import React from 'react';
import type { PendaftaranStatus } from '../types';
import { STATUS_LABEL } from '../types';

const STYLE: Record<PendaftaranStatus, string> = {
  baru: 'text-warm-orange bg-warm-orange/10',
  diverifikasi: 'text-deep-teal bg-[#e8eefd]',
  dijadwalkan: 'text-yasmin-green bg-soft-mint',
  selesai: 'text-deep-teal bg-soft-mint',
  dibatalkan: 'text-emergency bg-emergency/10',
};

export default function StatusBadge({ status }: { status: PendaftaranStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
