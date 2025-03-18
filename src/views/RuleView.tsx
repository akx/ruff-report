import React from "react";
import { useParams } from "wouter";
import { useLoadedReportData } from "../contexts/reportData";
import { countBy } from "../nodash";
import { ExtendedMessage } from "../types/ruff-report";
import { PopularityTable } from "../components/PopularityTable";
import { ruleMap } from "../data";
import { renderFileLink, renderRuleExplanation } from "./utils";
import { Facet } from "../types/ui";
import FacetTabs from "../components/FacetTabs";
import { NoDataAlert } from "../components/NoDataAlert";
import { RuleExplanation } from "../types/ruff";
import { Title } from "../components/Title";

const baseFacets: Facet[] = [
  {
    name: "By message",
    render: (messages: readonly ExtendedMessage[]) => {
      const messageCounts = countBy(messages, "message");
      return <PopularityTable header="Message" data={messageCounts} />;
    },
  },
  {
    name: "By file",
    render: (messages: readonly ExtendedMessage[]) => {
      const fileCounts = countBy(messages, "shortFilename");
      return (
        <PopularityTable
          header="Filename"
          data={fileCounts}
          keyRenderer={renderFileLink}
        />
      );
    },
  },
];

function RuleHeader({
  code,
  ruleInfo,
}: {
  code: string;
  ruleInfo: RuleExplanation | undefined;
}) {
  return (
    <div className="flex justify-between">
      <Title>
        {code}
        {ruleInfo ? <>&nbsp;&ndash;&nbsp;{ruleInfo.name}</> : null}
      </Title>
      {ruleInfo ? (
        <a
          className="btn btn-outline"
          href={`https://beta.ruff.rs/docs/rules/${ruleInfo.name}/`}
          target="_blank"
          rel="noreferrer"
        >
          View docs on ruff.rs
        </a>
      ) : null}
    </div>
  );
}

export default function RuleView() {
  const { code } = useParams<{ code: string }>();
  const { messages: allFilteredMessages } = useLoadedReportData().filtered;
  const messages = allFilteredMessages.filter((m) => m.code === code);
  const ruleInfo = code ? ruleMap[code] : undefined;
  const uniqueFiles = new Set(messages.map((m) => m.shortFilename));
  const facets = React.useMemo(
    () => [
      {
        name: "Explanation",
        render: () => (
          <div className="prose leading-normal">
            {renderRuleExplanation(ruleInfo)}
          </div>
        ),
      },
      ...baseFacets,
    ],
    [ruleInfo],
  );
  if (messages.length === 0 || !code) {
    return <NoDataAlert />;
  }
  return (
    <div className="p-4">
      <RuleHeader code={code} ruleInfo={ruleInfo} />
      <p>
        {messages.length.toLocaleString()} occurrences in{" "}
        {uniqueFiles.size.toLocaleString()} files
      </p>
      <FacetTabs facets={facets} messages={messages} />
    </div>
  );
}
