import { appVersion, ruffVersion } from "../data";
import React from "react";
import { standalone } from "../config";

export function NavBarInfoBox() {
  return (
    <div className="text-center p-1 text-sm">
      <b>ruff-report</b> {appVersion}
      {standalone ? <div>(standalone mode)</div> : null}
      <div>
        Rules from{" "}
        <a href="https://docs.astral.sh/ruff" className="link">
          Ruff
        </a>{" "}
        {ruffVersion}
      </div>
      Built by{" "}
      <a
        href="https://akx.github.io"
        target="_blank"
        rel="noreferrer"
        className="link"
      >
        @akx
      </a>{" "}
      &middot; Source on{" "}
      <a
        href="https://github.com/akx/ruff-report"
        target="_blank"
        className="link"
        rel="noreferrer"
      >
        GitHub
      </a>
    </div>
  );
}
