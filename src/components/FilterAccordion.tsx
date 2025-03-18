import {
  filterableKeyLabels,
  filterableKeys,
  ProcessedMessages,
  ValuesKey,
} from "../types/ruff-report";
import { FilterAPI } from "../hooks/useFilters";
import { ChipSelectMany } from "./ChipSelectMany";
import React from "react";
import cx from "clsx";

type FilterAccordionProps = {
  processed: ProcessedMessages;
} & Omit<FilterAPI, "resetFilters">;

function AccordionItem({
  processed,
  filters,
  valueKey,
  setFilter,
}: { valueKey: ValuesKey } & FilterAccordionProps) {
  const [open, setOpen] = React.useState(false);
  const valuesAndCounts = processed.values[valueKey];
  const selected = filters[valueKey];
  const suffix =
    selected.length === valuesAndCounts.length
      ? ""
      : ` (${selected.length} / ${valuesAndCounts.length})`;
  return (
    <div key={valueKey} className="py-1 border-b border-b-neutral-200">
      <button
        className={cx(
          "flex justify-between w-full py-1",
          processed.messages.length === 0
            ? "opacity-50"
            : "cursor-pointer hover:bg-neutral-100",
        )}
        disabled={processed.messages.length === 0}
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          {filterableKeyLabels[valueKey] ?? valueKey} {suffix}
        </span>
        <span className="px-3">{open ? "▲" : "▼"}</span>
      </button>
      {open ? (
        <div>
          <ChipSelectMany
            valuesAndCounts={valuesAndCounts}
            selected={selected}
            setSelected={(v) => setFilter(valueKey, v)}
          />
        </div>
      ) : null}
    </div>
  );
}

export function FilterAccordion(props: FilterAccordionProps) {
  return (
    <div>
      {filterableKeys.map((key) => (
        <AccordionItem key={key} valueKey={key} {...props} />
      ))}
    </div>
  );
}
