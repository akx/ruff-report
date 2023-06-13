import { Alert } from "@mantine/core";
import React from "react";

export function NoDataAlert() {
  return (
    <Alert title="No data!">
      There's no data to show. <br />
      Make sure your filters aren't hiding it..?
    </Alert>
  );
}
