import React from "react";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import router from "./router";

const theme = createTheme({});
function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <RouterProvider router={router} />
      </MantineProvider>
    </>
  );
}

export default App;
