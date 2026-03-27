import {
  filterableKeys,
  ProcessedMessages,
  ValuesKey,
} from "../types/ruff-report";
import React from "react";

export interface FilterAPI {
  filters: Record<ValuesKey, string[]>;
  setFilter: (key: ValuesKey, value: string[]) => void;
  resetFilters: () => void;
}

function getInitialFilters(processed: ProcessedMessages) {
  return Object.fromEntries(
    filterableKeys.map((k) => [k, processed.values[k].map((pair) => pair[0])]),
  ) as Record<ValuesKey, string[]>;
}

export function useFilters(processed: ProcessedMessages): FilterAPI {
  const [filtersData, setFiltersData] = React.useState<
    Record<ValuesKey, string[]>
  >(() => getInitialFilters(processed));
  const resetFilters = React.useCallback(
    () => setFiltersData(getInitialFilters(processed)),
    [processed],
  );
  const processedRef = React.useRef(processed);
  if (processedRef.current !== processed) {
    processedRef.current = processed;
    setFiltersData(getInitialFilters(processed));
  }
  const setFilter = React.useCallback((key: ValuesKey, value: string[]) => {
    setFiltersData((prev) => ({ ...prev, [key]: value }));
  }, []);
  return { filters: filtersData, setFilter, resetFilters };
}
