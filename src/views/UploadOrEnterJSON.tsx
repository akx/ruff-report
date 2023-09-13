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
import { IconUpload, IconX } from "@tabler/icons-react";
import React from "react";
import { useReportData } from "../contexts/reportData";
import { useNavigate } from "react-router-dom";
import { Message } from "../types/ruff";
import { parseRawJSONAsRuffData } from "../utils";

export default function UploadOrEnterJSON() {
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
    <>
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
    </>
  );
}
