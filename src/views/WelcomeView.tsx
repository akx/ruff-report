import {
  Button,
  Code,
  Container,
  Grid,
  Group,
  JsonInput,
  rem,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import { useReportData } from "../contexts/reportData";
import { useNavigate } from "react-router-dom";
import { IconUpload, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import { Message } from "../types/ruff";
import { parseRawJSONAsRuffData } from "../utils";

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
  const [data, setData] = React.useState<Message[] | null>(null);
  const isValid = data !== null;

  function handleJSON(result: string | ArrayBuffer) {
    setData(null);
    try {
      const messages = parseRawJSONAsRuffData(result);
      if (messages) {
        setData(messages);
      }
    } catch (e) {}
  }

  const handleFile = (f: File): Promise<Message[] | null> => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          try {
            const messages = parseRawJSONAsRuffData(result);
            if (messages) {
              setData(messages);
            }
            res(messages);
          } catch (e) {}
        } else {
          rej();
        }
      };
      reader.onerror = rej;
      reader.readAsText(f);
    });
  };

  const commit = (data: Message[] | null) => {
    if (data) {
      setRawData(data);
      navigate("/report");
    }
  };

  const handleDrop = async (files: readonly File[]) => {
    const [file] = files;
    if (file) {
      const res = await handleFile(file);
      if (res) commit(res);
    }
  };
  return (
    <Container>
      <Prose />
      <Grid grow>
        <Grid.Col span={1}>
          <Title order={3}>Select a JSON file</Title>
          <Dropzone onDrop={handleDrop} multiple={false}>
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: rem(220), pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload size="3.2rem" stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size="3.2rem" stroke={1.5} />
              </Dropzone.Reject>
              <div>
                <Text size="xl" inline>
                  Drag a JSON file here or click to browse for one
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Grid.Col>

        <Grid.Col span={1}>
          <Title order={3}>...or paste JSON</Title>

          <JsonInput
            validationError="Invalid JSON"
            formatOnBlur
            autosize
            minRows={8}
            onChange={handleJSON}
          />
        </Grid.Col>
      </Grid>
      <Button mt={4} disabled={!isValid} onClick={() => commit(data)}>
        Let's go!
      </Button>
    </Container>
  );
}
