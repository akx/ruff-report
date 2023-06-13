import React from "react";
import { Table } from "@mantine/core";
import { useReportData } from "../contexts/reportData";
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
        <Table>
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
        </Table>
      );
    },
  },
];

export default function FilesView() {
  const { messages } = useReportData().filtered;
  if (!messages.length) {
    return <NoDataAlert />;
  }
  return <FacetTabs facets={facets} messages={messages} />;
}
