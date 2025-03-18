import { Facet } from "../types/ui";
import React from "react";
import { ExtendedMessage } from "../types/ruff-report";
import cx from "clsx";

export default function FacetTabs({
  facets,
  messages,
}: {
  facets: Facet[];
  messages: readonly ExtendedMessage[];
}) {
  const [facet, setFacet] = React.useState(() => facets[0]?.name ?? "none");
  return (
    <div>
      <div className="tabs tabs-border mb-2">
        {facets.map(({ name }) => (
          <button
            onClick={() => setFacet(name)}
            className={cx("tab", name === facet ? "tab-active" : null)}
            key={name}
          >
            {name}
          </button>
        ))}
      </div>
      {facets.map(({ name, render }) =>
        facet === name ? <div key={name}>{render(messages)}</div> : null,
      )}
    </div>
  );
}
