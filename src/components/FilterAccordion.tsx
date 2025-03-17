import {
  filterableKeyLabels,
  filterableKeys,
  ProcessedMessages,
  ValuesKey,
} from "../types/ruff-report";
import { FilterAPI } from "../hooks/useFilters";
import { Accordion } from "@mantine/core";
import { ChipSelectMany } from "./ChipSelectMany";
import React from "react";

type FilterAccordionProps = {
  processed: ProcessedMessages;
} & Omit<FilterAPI, "resetFilters">;

export function FilterAccordion({
  processed,
  filters,
  setFilter,
}: FilterAccordionProps) {
  function renderAccordionItem(key: ValuesKey) {
    const valuesAndCounts = processed.values[key];
    const selected = filters[key];
    const suffix =
      selected.length === valuesAndCounts.length
        ? ""
        : ` (${selected.length} / ${valuesAndCounts.length})`;
    return (
      <Accordion.Item key={key} value={key}>
        <Accordion.Control disabled={processed.messages.length === 0}>
          {filterableKeyLabels[key] ?? key} {suffix}
        </Accordion.Control>
        <Accordion.Panel>
          <ChipSelectMany
            valuesAndCounts={valuesAndCounts}
            selected={selected}
            setSelected={(v) => setFilter(key, v)}
          />
        </Accordion.Panel>
      </Accordion.Item>
    );
  }

  return (
    <Accordion multiple>
      {filterableKeys.map((key) => renderAccordionItem(key))}
    </Accordion>
  );
}
