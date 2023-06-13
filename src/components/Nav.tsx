import {
  Button,
  Group,
  Navbar,
  NavLink,
  Paper,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { FilterAccordion } from "./FilterAccordion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useReportData } from "../contexts/reportData";

export function Nav() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { processed, filters } = useReportData();
  return (
    <Navbar p="sm" width={{ base: 300 }}>
      <Navbar.Section
        sx={{
          paddingBottom: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
          borderBottom: `${rem(1)} solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        }}
      >
        <Group grow>
          <NavLink label="Home" onClick={() => navigate("/")} />
          <NavLink label="Files" onClick={() => navigate("/files")} />
        </Group>
      </Navbar.Section>
      <Navbar.Section grow>
        <Group>
          <span>Filters</span>
          <Button
            size="xs"
            compact
            variant="outline"
            onClick={filters.resetFilters}
          >
            Reset
          </Button>
        </Group>
        <FilterAccordion processed={processed} {...filters} />
      </Navbar.Section>
      <Navbar.Section>
        <Paper shadow="xs" p="xs" sx={{ textAlign: "center" }}>
          <b>ruff-report</b> built by{" "}
          <a href="https://akx.github.io" target="_blank" rel="noreferrer">
            @akx
          </a>
          <br />
          <a
            href="https://github.com/akx/ruff-report"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </Paper>
      </Navbar.Section>
    </Navbar>
  );
}
