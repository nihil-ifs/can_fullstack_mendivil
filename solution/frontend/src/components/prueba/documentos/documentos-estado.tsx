import React from 'react';

interface EstadoBadgeProps {
  estado: string;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  let color = 'gray';
  if (estado === 'QUEUED') color = '#FACC15';
  if (estado === 'PROCESSING') color = '#3B82F6';
  if (estado === 'PROCESSED') color = '#16A34A';
  if (estado === 'ERROR') color = '#DC2626';

  return (
    <span
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 600,
        color: 'white',
        backgroundColor: color,
      }}
    >
      {estado}
    </span>
  );
}
