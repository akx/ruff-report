import React from "react";
import { processMessages } from "../process";
import { Message } from "../types/ruff";
import { FilterAPI, useFilters } from "../hooks/useFilters";
import { ProcessedMessages, ValuesKey } from "../types/ruff-report";
import { AppShell } from "@mantine/core";
import {
  ReportDataContext,
  ReportDataContextType,
} from "../contexts/reportData";
import { Nav } from "../components/Nav";

function applyFilters(
  processed: ProcessedMessages,
  filters: FilterAPI["filters"],
) {
  return {
    ...processed,
    messages: processed.messages.filter((m) =>
      Object.entries(filters).every(([prop, values]) =>
        values.includes(m[prop as ValuesKey]),
      ),
    ),
  };
}

export default function Root({ children }: React.PropsWithChildren) {
  const [rawData, setRawData] = React.useState<Message[] | null>(null);
  const processed = React.useMemo(
    () => processMessages(rawData ?? []),
    [rawData],
  );
  const filters = useFilters(processed);
  const filtered = React.useMemo(
    () => applyFilters(processed, filters.filters),
    [filters, processed],
  );
  const reportDataContext: ReportDataContextType = React.useMemo(
    () => ({
      processed,
      filtered,
      filters,
      rawData: rawData ?? [],
      setRawData,
      loaded: rawData !== null,
    }),
    [processed, filtered, filters, rawData],
  );
  return (
    <ReportDataContext.Provider value={reportDataContext}>
      <AppShell
        padding="sm"
        navbar={{
          breakpoint: "sm",
          width: 300,
        }}
      >
        <AppShell.Main>{children}</AppShell.Main>
        <Nav />
      </AppShell>
    </ReportDataContext.Provider>
  );
}
