import { createHashRouter, Navigate } from "react-router-dom";
import Root from "./views/Root";
import React from "react";
import WelcomeView from "./views/WelcomeView";
import BasicReportView from "./views/BasicReportView";
import RuleView from "./views/RuleView";
import { useReportData } from "./contexts/reportData";
import FileView from "./views/FileView";
import FilesView from "./views/FilesView";

// eslint-disable-next-line react-refresh/only-export-components
const Dispatch = () => {
  const { rawData } = useReportData();
  return rawData.length === 0 ? <Navigate to="/welcome" replace={true} /> : <Navigate to="/report" replace={true} />;
};

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "welcome",
        element: <WelcomeView />,
      },
      {
        path: "report",
        element: <BasicReportView />,
      },
      {
        path: "files",
        element: <FilesView />,
      },
      {
        path: "rule/:code",
        element: <RuleView />,
      },
      {
        path: "file/*",
        element: <FileView />,
      },
      {
        index: true,
        element: <Dispatch />,
      },
    ],
  },
]);

export default router;
