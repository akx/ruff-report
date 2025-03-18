import React from "react";
import cx from "clsx";

interface ChipSelectManyProps {
  valuesAndCounts: [string, number][];
  selected: string[];
  setSelected: (v: string[]) => void;
}

export function ChipSelectMany({
  valuesAndCounts,
  selected,
  setSelected,
}: ChipSelectManyProps) {
  const selectedSet = new Set(selected);
  return (
    <>
      <div className="join py-2">
        <button
          className="btn btn-outline btn-sm join-item"
          onClick={() => setSelected(valuesAndCounts.map((v) => v[0]))}
        >
          All ({valuesAndCounts.length})
        </button>
        <button
          className="btn btn-outline btn-sm join-item"
          onClick={() => setSelected([])}
        >
          None
        </button>
      </div>
      <div className="overflow-y-auto overflow-x-hidden max-h-64">
        <div className="flex flex-wrap gap-1">
          {valuesAndCounts.map(([value, count]) => (
            <button
              className={cx(
                "badge badge-sm m-0 cursor-pointer",
                selectedSet.has(value) ? "badge-primary" : "badge-soft",
              )}
              key={value}
              onClick={() =>
                setSelected(
                  selected.includes(value)
                    ? selected.filter((v) => v !== value)
                    : [...selected, value],
                )
              }
            >
              {value} ({count})
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
