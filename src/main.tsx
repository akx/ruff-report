import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { loadRuleMap } from "./data";

// With any luck, this will have loaded
// the rule map by the time something that requires it is rendered.
void loadRuleMap();

const rootElement = document.querySelector("#root");
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
