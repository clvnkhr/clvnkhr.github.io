interface UpdateDatesTooltipProps {
  updated?: Date[];
  date?: Date;
  formatDate: (date: Date) => string;
}

export function UpdateDatesTooltip({ updated, date, formatDate }: UpdateDatesTooltipProps) {
  const history = Array.from(new Set(
    (updated ?? []).map((update) => update.getTime()).filter((time) => time !== date?.getTime()),
  )).sort((a, b) => a - b).map((time) => new Date(time));

  if (history.length === 0) return null;
  const mostRecentUpdate = history[history.length - 1];

  return (
    <details className="update-dates relative text-ctp-subtext0 text-sm">
      <summary className="cursor-pointer">
        Updated <time dateTime={mostRecentUpdate.toISOString()}>{formatDate(mostRecentUpdate)}</time>
      </summary>
      <div className="absolute left-0 top-full mt-2 w-max max-w-xs bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-3 shadow-lg z-50">
        <div className="text-xs text-ctp-subtext1 mb-2">Update History</div>
        <ul className="space-y-1">
          {history.map((updateDate) => (
            <li key={updateDate.toISOString()} className="text-sm text-ctp-text">
              <time dateTime={updateDate.toISOString()}>{formatDate(updateDate)}</time>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
