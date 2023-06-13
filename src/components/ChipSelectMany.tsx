import { Button, Chip, Group } from "@mantine/core";
import React from "react";

type ChipSelectManyProps = {
  valuesAndCounts: [string, number][];
  selected: string[];
  setSelected: (v: string[]) => void;
};

export function ChipSelectMany({
  valuesAndCounts,
  selected,
  setSelected,
}: ChipSelectManyProps) {
  return (
    <>
      <Button.Group>
        <Button
          variant="default"
          size="xs"
          onClick={() => setSelected(valuesAndCounts.map((v) => v[0]))}
        >
          All ({valuesAndCounts.length})
        </Button>
        <Button variant="default" size="xs" onClick={() => setSelected([])}>
          None
        </Button>
      </Button.Group>
      <div style={{ maxHeight: 250, overflowY: "auto", overflowX: "hidden" }}>
        <Chip.Group multiple value={selected} onChange={setSelected}>
          <Group position="left" spacing={2}>
            {valuesAndCounts.map(([value, count]) => (
              <Chip key={value} value={value} size="xs">
                {value} ({count})
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </div>
    </>
  );
}
