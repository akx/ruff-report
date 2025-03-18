import { sum } from "../nodash";
import React from "react";
import { alignRight } from "../styles";

type PopularityTableProps = {
  header: string;
  data: Record<string, number>;
  keyRenderer?: ((key: string) => React.ReactNode) | undefined;
};

function getProgressBackground(count: number, total: number) {
  return `linear-gradient(to right, var(--color-primary) ${
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
    <table className="table table-zebra table-xs">
      <thead>
        <tr>
          <th>{header}</th>
          <th className="text-right">Count</th>
          <th className="text-right">% of total</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(([key, count]) => (
          <tr key={key}>
            <td>{keyRenderer ? keyRenderer(key) : key}</td>
            <td className="text-right">{count.toLocaleString()}</td>
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
    </table>
  );
}
