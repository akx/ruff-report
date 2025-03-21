import { ProcessedMessages } from "../types/ruff-report";
import { Message } from "../types/ruff";
import { createContext, useContext } from "react";
import { FilterAPI } from "../hooks/useFilters";
import { useLocation } from "wouter";

export interface ReportDataContextType {
  filtered: ProcessedMessages;
  filters: FilterAPI;
  loaded: boolean;
  processed: ProcessedMessages;
  rawData: Message[];
  setRawData: (data: Message[]) => void;
}

export const ReportDataContext = createContext<ReportDataContextType>(
  null as never,
);

export function useReportData() {
  return useContext(ReportDataContext);
}

export function useLoadedReportData() {
  const rd = useReportData();
  const [, navigate] = useLocation();
  if (!rd.loaded) {
    navigate("/");
    return { ...rd, loaded: true, rawData: [] };
  }
  return rd;
}
