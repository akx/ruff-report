import { ExtendedMessage } from "./ruff-report";
import React from "react";

export interface Facet {
  name: string;
  render: (messages: readonly ExtendedMessage[]) => React.ReactNode;
}
