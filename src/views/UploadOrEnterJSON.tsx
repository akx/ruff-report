import {
  Button,
  Grid,
  Group,
  JsonInput,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import React from "react";
import { useReportData } from "../contexts/reportData";
import { Message } from "../types/ruff";
import { parseRawJSONAsRuffData } from "../utils";
import { useLocation } from "wouter";

export default function UploadOrEnterJSON() {
  const { setRawData } = useReportData();
  const [, navigate] = useLocation();
  const [data, setData] = React.useState<Message[] | null>(null);
  const isValid = data !== null;

  function handleJSON(result: string | ArrayBuffer) {
    setData(null);
    try {
      const messages = parseRawJSONAsRuffData(result);
      if (messages) {
        setData(messages);
      }
    } catch (_error) {
      // Ah well!
    }
  }

  const commit = (data: Message[] | null) => {
    if (data) {
      setRawData(data);
      navigate("/report");
    }
  };

  const handleDrop = async (files: readonly File[]) => {
    const [file] = files;
    if (file) {
      handleJSON(await file.text());
    }
  };
  return (
    <>
      <Grid grow>
        <Grid.Col span={1}>
          <Title order={3}>Select a JSON file</Title>
          <Dropzone onDrop={handleDrop} multiple={false}>
            <Group style={{ minHeight: rem(220), pointerEvents: "none" }}>
              <Text size="xl" inline>
                Drag a JSON file here or click to browse for one
              </Text>
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
    </>
  );
}
