import { Code, Loader, Paper } from "@mantine/core";
import React from "react";
import { useReportData } from "../contexts/reportData";
import { useNavigate } from "react-router-dom";
import { useInterval } from "@mantine/hooks";

export default function StandaloneDataFinder() {
  const { setRawData } = useReportData();
  const navigate = useNavigate();
  const tryLoadScript = React.useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__RUFF_REPORT_DATA__ = undefined;
    const scriptTag = document.createElement("script");
    scriptTag.src = `./ruff-report.js?${Date.now()}`;
    scriptTag.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (window as any).__RUFF_REPORT_DATA__;
      if (data && Array.isArray(data)) {
        setRawData(data);
        navigate("/report");
      }
      scriptTag.remove();
    };
    scriptTag.onerror = () => {
      scriptTag.remove();
    };
    document.body.appendChild(scriptTag);
  }, [navigate, setRawData]);
  const interval = useInterval(tryLoadScript, 300);
  React.useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);
  return (
    <Paper shadow="sm" p="sm" mt="sm" sx={{ textAlign: "center" }}>
      <Loader size="xs" />
      &nbsp;Trying to load <Code>ruff-report.js</Code> in the same directory as
      this file...
      <Paper shadow="sm" p="sm" mt="sm">
        On an UNIX-like system, you can generate a compatible file with
        something like: <br />
        <Code>
          echo "var __RUFF_REPORT_DATA__ =" &gt; ruff-report.js && ruff
          --select=ALL . --format=json &gt;&gt; ruff-report.js
        </Code>
      </Paper>
    </Paper>
  );
}
