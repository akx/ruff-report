import { Code, Container, Title } from "@mantine/core";
import React from "react";
import { standalone } from "../config";
import UploadOrEnterJSON from "./UploadOrEnterJSON";
import StandaloneDataFinder from "./StandaloneDataFinder";
import { RUFF_INCANTATION } from "../consts";

function Prose() {
  return (
    <>
      <Title>Welcome!</Title>
      <p>
        This tool helps you analyze a{" "}
        <a href="https://ruff.rs" target="_blank" rel="noreferrer">
          Ruff
        </a>{" "}
        JSON report, to help you figure out where to focus your code-cleaning
        efforts. I personally might recommend just doing{" "}
        <Code>{RUFF_INCANTATION} &gt; report.json</Code> to start with.
      </p>
      <p>
        Please choose a Ruff-generated JSON file to view. Rest assured that your
        data will not be uploaded anywhere, we'll just process it in your
        browser.
      </p>
    </>
  );
}

export default function WelcomeView() {
  return (
    <Container>
      <Prose />
      <UploadOrEnterJSON />

      {standalone ? <StandaloneDataFinder /> : null}
    </Container>
  );
}
