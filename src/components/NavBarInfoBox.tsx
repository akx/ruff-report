import { Paper } from "@mantine/core";
import { appVersion, ruffVersion } from "../data";
import React from "react";
import { standalone } from "../config";

export function NavBarInfoBox() {
  return (
    <Paper shadow="xs" p="xs" sx={{ textAlign: "center" }}>
      <b>ruff-report</b> {appVersion}
      {standalone ? <div>(standalone mode)</div> : null}
      <br />
      <small>
        Rules from {ruffVersion}
        <br />
      </small>
      Built by{" "}
      <a href="https://akx.github.io" target="_blank" rel="noreferrer">
        @akx
      </a>{" "}
      &middot; Source on{" "}
      <a
        href="https://github.com/akx/ruff-report"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </Paper>
  );
}
