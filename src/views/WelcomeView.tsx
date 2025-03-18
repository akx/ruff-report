import React from "react";
import { standalone } from "../config";
import UploadOrEnterJSON from "./UploadOrEnterJSON";
import StandaloneDataFinder from "./StandaloneDataFinder";
import { RUFF_INCANTATION } from "../consts";
import { Title } from "../components/Title";

function Prose() {
  return (
    <>
      <Title className="mb-4">Welcome!</Title>
      <div className="prose leading-normal mb-4 ">
        <p>
          This tool helps you analyze a{" "}
          <a href="https://ruff.rs" target="_blank" rel="noreferrer">
            Ruff
          </a>{" "}
          JSON report, to help you figure out where to focus your code-cleaning
          efforts. I personally might recommend just doing{" "}
          <code>{RUFF_INCANTATION} &gt; report.json</code> to start with.
        </p>
        <p>
          Please choose a Ruff-generated JSON file to view. Rest assured that
          your data will not be uploaded anywhere, we'll just process it in your
          browser.
        </p>
      </div>
    </>
  );
}

export default function WelcomeView() {
  return (
    <div className="container mx-auto p-4">
      <Prose />
      <UploadOrEnterJSON />
      {standalone ? <StandaloneDataFinder /> : null}
    </div>
  );
}
