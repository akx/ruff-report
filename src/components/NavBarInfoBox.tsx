import { appVersion, ruffVersion, getRuleMap } from "../data";
import React from "react";
import { standalone } from "../config";
import { useInterval } from "../hooks";

function RulesInfo() {
  const [nRules, setNRules] = React.useState<number | null>(null);
  useInterval(
    () => {
      setNRules(Object.keys(getRuleMap()).length);
    },
    nRules == null ? 100 : null,
  );
  return (
    <div>
      {nRules === null ? `Rules` : `${nRules} rules`} from{" "}
      <a href="https://docs.astral.sh/ruff" className="link">
        Ruff
      </a>{" "}
      {ruffVersion}
    </div>
  );
}

export function NavBarInfoBox() {
  return (
    <div className="text-center p-1 text-sm">
      <b>ruff-report</b> {appVersion}
      {standalone ? <div>(standalone mode)</div> : null}
      <RulesInfo />
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
