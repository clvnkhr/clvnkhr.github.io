import React from 'react';

interface UpdateDatesTooltipProps {
  updated?: Date[];
  date?: Date;
  formatDate: (date: Date) => string;
}

export function UpdateDatesTooltip({ updated, date, formatDate }: UpdateDatesTooltipProps) {
  if (!updated || updated.length === 0) {
    return null;
  }

  const hasUpdates = date
    ? updated.some((d: Date) => d !== date)
    : true;

  if (!hasUpdates) {
    return null;
  }

  const mostRecentUpdate = updated[updated.length - 1];

  return (
    <span className="group relative text-ctp-subtext0 text-sm cursor-help">
      Updated {formatDate(mostRecentUpdate)}
      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max max-w-xs bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-3 shadow-lg z-50">
        <div className="text-xs text-ctp-subtext1 mb-2">Update History</div>
        <div className="space-y-1">
          {updated.map((updateDate: Date, index: number) => (
            <div key={index} className="text-sm text-ctp-text">
              {formatDate(updateDate)}
            </div>
          ))}
        </div>
        <div className="absolute left-4 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-ctp-surface1"></div>
      </div>
    </span>
  );
}
