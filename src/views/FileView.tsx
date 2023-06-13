import React from "react";
import { useParams } from "react-router-dom";
import { Badge, Table, Title } from "@mantine/core";
import { useReportData } from "../contexts/reportData";
import { countBy } from "lodash";
import { ExtendedMessage } from "../types/ruff-report";
import { PopularityTable } from "../components/PopularityTable";
import { renderCodeLink } from "./utils";
import { Facet } from "../types/ui";
import FacetTabs from "../components/FacetTabs";
import { NoDataAlert } from "../components/NoDataAlert";

const facets: Facet[] = [
  {
    name: "Report",
    render: (messages: readonly ExtendedMessage[]) => {
      return (
        <Table>
          <thead>
            <tr>
              <th>Line</th>
              <th>Code</th>
              <th>Message</th>
              <th>Fixable?</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, i) => (
              <tr key={i}>
                <td>{message.location.row}</td>
                <td>{message.code}</td>
                <td>{message.message}</td>
                <td>
                  {message.fix ? <Badge color="green">Fixable</Badge> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    },
  },
  {
    name: "By code",
    render: (messages: readonly ExtendedMessage[]) => {
      const codeCounts = countBy(messages, "code");
      return (
        <PopularityTable
          header="Message"
          data={codeCounts}
          keyRenderer={renderCodeLink}
        />
      );
    },
  },
];

export default function FileView() {
  const { ["*"]: file } = useParams<{ ["*"]: string }>();
  const { messages: allFilteredMessages } = useReportData().filtered;
  const messages = allFilteredMessages.filter((m) => m.shortFilename === file);
  if (!messages.length || !file) {
    return <NoDataAlert />;
  }
  const uniqueCodes = new Set(messages.map((m) => m.code));
  return (
    <>
      <Title>{file}</Title>
      <p>
        {messages.length.toLocaleString()} messages,&nbsp;
        {uniqueCodes.size.toLocaleString()} rules
      </p>
      <FacetTabs facets={facets} messages={messages} />
    </>
  );
}
