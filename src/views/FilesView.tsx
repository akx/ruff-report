import React from "react";
import { useLoadedReportData } from "../contexts/reportData";
import { ExtendedMessage } from "../types/ruff-report";
import { renderFileLink } from "./utils";
import { Facet } from "../types/ui";
import FacetTabs from "../components/FacetTabs";
import { groupAndSort } from "../process";
import { alignRight } from "../styles";
import { NoDataAlert } from "../components/NoDataAlert";

const facets: Facet[] = [
  {
    name: "By number of issues",
    render: (messages: readonly ExtendedMessage[]) => {
      const byFile = groupAndSort(messages, "shortFilename");
      return (
        <table className="table table-zebra table-sm">
          <thead>
            <tr>
              <th>File</th>
              <th style={alignRight}>Issues</th>
              <th style={alignRight}>Fixable</th>
            </tr>
          </thead>
          <tbody>
            {byFile.map(([file, messages], i) => {
              return (
                <tr key={i}>
                  <td>{renderFileLink(file)}</td>
                  <td style={alignRight}>{messages.length.toLocaleString()}</td>
                  <td style={alignRight}>
                    {messages.filter((m) => m.fix).length.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    },
  },
];

export default function FilesView() {
  const { messages } = useLoadedReportData().filtered;
  if (messages.length === 0) {
    return <NoDataAlert />;
  }
  return <FacetTabs facets={facets} messages={messages} />;
}
