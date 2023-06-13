import {
  Button,
  Code,
  Container,
  FileInput,
  Grid,
  JsonInput,
  Title,
} from "@mantine/core";
import React from "react";
import { useReportData } from "../contexts/reportData";
import { useNavigate } from "react-router-dom";

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
        <Code>ruff --select=ALL --format=json . &gt; report.json</Code> to start
        with.
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
  const { setRawData } = useReportData();
  const navigate = useNavigate();
  const [data, setData] = React.useState<any | null>(null);
  const isValid = data !== null;

  function handleJSON(result: string | ArrayBuffer) {
    setData(null);
    if (typeof result !== "string") {
      return;
    }
    try {
      const data = JSON.parse(result);
      if (data && Array.isArray(data)) {
        setData(data);
      }
    } catch (e) {}
  }

  const handleFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      result && handleJSON(result);
    };
    reader.readAsText(f);
  };

  const commit = () => {
    if (data) {
      setRawData(data);
      navigate("/report");
    }
  };

  return (
    <Container>
      <Prose />
      <Grid grow>
        <Grid.Col span={1}>
          <Title order={2}>Select a JSON file</Title>
          <FileInput placeholder="Pick JSON file" onChange={handleFile} />
        </Grid.Col>

        <Grid.Col span={1}>
          <Title order={2}>...or paste JSON</Title>

          <JsonInput
            validationError="Invalid JSON"
            formatOnBlur
            autosize
            minRows={8}
            onChange={handleJSON}
          />
        </Grid.Col>
      </Grid>
      <Button disabled={!isValid} onClick={commit}>
        Let's go!
      </Button>
    </Container>
  );
}
