import { filterableKeyLabels, filterableKeys } from "../types/ruff-report";
import { PopularityTable } from "../components/PopularityTable";
import { countBy } from "../nodash";
import React from "react";
import { useLoadedReportData } from "../contexts/reportData";
import { renderCodeLink } from "./utils";
import { Facet } from "../types/ui";
import FacetTabs from "../components/FacetTabs";
import { NoDataAlert } from "../components/NoDataAlert";
import { Title } from "../components/Title";

const facets: Facet[] = filterableKeys.map((key) => ({
  name: `By ${filterableKeyLabels[key] ?? key}`,
  render: (messages) => {
    const counts = countBy(messages, key);
    return (
      <PopularityTable
        header={filterableKeyLabels[key] ?? key}
        data={counts}
        keyRenderer={key === "code" ? renderCodeLink : undefined}
      />
    );
  },
}));

export default function BasicReportView() {
  const { messages } = useLoadedReportData().filtered;
  if (messages.length === 0) {
    return <NoDataAlert />;
  }
  return (
    <div className="p-4">
      <Title>Total {messages.length.toLocaleString()} messages</Title>
      <FacetTabs facets={facets} messages={messages} />
    </div>
  );
}
