import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";

import { Redirect, Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import Root from "./views/Root";
import React from "react";
import WelcomeView from "./views/WelcomeView";
import BasicReportView from "./views/BasicReportView";
import RuleView from "./views/RuleView";
import { useReportData } from "./contexts/reportData";
import FileView from "./views/FileView";
import FilesView from "./views/FilesView";

function Dispatch() {
  const { rawData } = useReportData();
  return rawData.length === 0 ? (
    <Redirect to="/welcome" replace={true} />
  ) : (
    <Redirect to="/report" replace={true} />
  );
}

const theme = createTheme({});
function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <Router hook={useHashLocation}>
          <Root>
            <Switch>
              <Route path="/welcome" component={WelcomeView} />
              <Route path="/report" component={BasicReportView} />
              <Route path="/files" component={FilesView} />
              <Route path="/rule/:code" component={RuleView} />
              <Route path="/file/*" component={FileView} />
              <Route path="/*" component={Dispatch} />
            </Switch>
          </Root>
        </Router>
      </MantineProvider>
    </>
  );
}

export default App;
