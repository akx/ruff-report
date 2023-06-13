import { Facet } from "../types/ui";
import { Tabs } from "@mantine/core";
import React from "react";
import { ExtendedMessage } from "../types/ruff-report";

export default function FacetTabs({
  facets,
  messages,
}: {
  facets: Facet[];
  messages: readonly ExtendedMessage[];
}) {
  return (
    <Tabs keepMounted={false} defaultValue={facets[0]?.name ?? "none"}>
      <Tabs.List>
        {facets.map(({ name }) => (
          <Tabs.Tab value={name} key={name}>
            {name}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {facets.map(({ name, render }) => (
        <Tabs.Panel value={name} key={name}>
          {render(messages)}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
