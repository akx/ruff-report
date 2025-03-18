import {
  Button,
  Group,
  AppShell,
  NavLink,
  rem,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { FilterAccordion } from "./FilterAccordion";
import React from "react";
import { useLocation } from "wouter";
import { useReportData } from "../contexts/reportData";
import { NavBarInfoBox } from "./NavBarInfoBox";

export function Nav() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [, navigate] = useLocation();
  const { processed, filters } = useReportData();
  return (
    <AppShell.Navbar p="sm">
      <AppShell.Section
        style={{
          paddingBottom: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
          borderBottom: `${rem(1)} solid ${
            colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
          }`,
        }}
      >
        <Group grow>
          <NavLink label="Home" onClick={() => navigate("/")} />
          <NavLink label="Files" onClick={() => navigate("/files")} />
        </Group>
      </AppShell.Section>
      <AppShell.Section grow>
        <Group justify="space-between">
          <span>Filters</span>
          <Button
            size="compact-xs"
            variant="outline"
            onClick={filters.resetFilters}
          >
            Reset
          </Button>
        </Group>
        <FilterAccordion processed={processed} {...filters} />
      </AppShell.Section>
      <AppShell.Section>
        <NavBarInfoBox />
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
