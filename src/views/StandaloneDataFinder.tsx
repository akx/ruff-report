import React from "react";
import { useReportData } from "../contexts/reportData";
import { useLocation } from "wouter";
import { useInterval } from "../hooks";
import { RUFF_INCANTATION } from "../consts";

export default function StandaloneDataFinder() {
  const { setRawData } = useReportData();
  const [, navigate] = useLocation();
  const tryLoadScript = React.useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__RUFF_REPORT_DATA__ = undefined;
    const scriptTag = document.createElement("script");
    scriptTag.src = `./ruff-report.js?${Date.now()}`;
    scriptTag.addEventListener("load", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (globalThis as any).__RUFF_REPORT_DATA__;
      if (data && Array.isArray(data)) {
        setRawData(data);
        navigate("/report");
      }
      scriptTag.remove();
    });
    scriptTag.addEventListener("error", () => {
      scriptTag.remove();
    });
    document.body.append(scriptTag);
  }, [navigate, setRawData]);
  useInterval(tryLoadScript, 300);
  return (
    <div className="shadow-lg p-2 mt-2 text-center">
      <div className="loading loading-infinity text-primary loading-lg"></div>
      <div>
        Trying to load{" "}
        <span className="font-mono font-bold">ruff-report.js</span> in the same
        directory as this file...
      </div>
      <div className="p-2 mt-2 text-center shadow-md">
        On an UNIX-like system, you can generate a compatible file with
        something like: <br />
        <div className="font-mono text-xs p-2">
          echo "var __RUFF_REPORT_DATA__ =" &gt; ruff-report.js &&{" "}
          {RUFF_INCANTATION} &gt;&gt; ruff-report.js
        </div>
      </div>
    </div>
  );
}
