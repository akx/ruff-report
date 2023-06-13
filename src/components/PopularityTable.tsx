import { sum } from "lodash";
import { Table } from "@mantine/core";
import React from "react";
import { alignRight } from "../styles";

type PopularityTableProps = {
  header: string;
  data: Record<string, number>;
  keyRenderer?: ((key: string) => React.ReactNode) | undefined;
};

function getProgressBackground(count: number, total: number) {
  return `linear-gradient(to right, #c0c0c0 ${
    (count / total) * 100
  }%, transparent 0%)`;
}

export function PopularityTable({
  header,
  data,
  keyRenderer,
}: PopularityTableProps) {
  const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = sum(Object.values(data));
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>{header}</th>
          <th>Count</th>
          <th>% of total</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(([key, count]) => (
          <tr key={key}>
            <td>{keyRenderer ? keyRenderer(key) : key}</td>
            <td style={alignRight}>{count.toLocaleString()}</td>
            <td
              style={{
                ...alignRight,
                background: getProgressBackground(count, total),
              }}
            >
              {(count / total).toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
