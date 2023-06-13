import { ProcessedMessages } from "../types/ruff-report";
import { Message } from "../types/ruff";
import { createContext, useContext } from "react";
import { FilterAPI } from "../hooks/useFilters";

interface ReportDataContext {
  setRawData: (data: Message[]) => void;
  rawData: Message[];
  processed: ProcessedMessages;
  filtered: ProcessedMessages;
  filters: FilterAPI;
}

const ReportDataContext = createContext<ReportDataContext>(null as never);

function useReportData() {
  return useContext(ReportDataContext);
}

export { ReportDataContext, useReportData };
