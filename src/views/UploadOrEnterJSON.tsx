import React from "react";
import { useReportData } from "../contexts/reportData";
import { Message } from "../types/ruff";
import { parseRawJSONAsRuffData } from "../utils";
import { useLocation } from "wouter";
import { Title } from "../components/Title";

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
      return messages;
    } catch (_error) {
      // Ah well!
    }
    return null;
  }

  const commit = (data: Message[] | null) => {
    if (data) {
      setRawData(data);
      navigate("/report");
    }
  };

  const handleDrop = async (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      commit(handleJSON(await file.text()));
    }
  };
  return (
    <>
      <div className="grow grid grid-cols-2 gap-4 py-2">
        <div>
          <Title order={3}>Select a JSON file</Title>
          <div className="relative border-dashed border-2 border-neutral-200 rounded-lg p-4 text-center min-h-40 flex items-center justify-center">
            Drag a JSON file here or click to browse for one
            <input
              type="file"
              className="absolute inset-0 w-full opacity-0"
              onChange={(e) => handleDrop(e.target.files)}
            />
          </div>
        </div>
        <div>
          <Title order={3}>...or paste JSON</Title>
          <textarea
            className="textarea w-full min-h-40"
            onChange={(e) => handleJSON(e.target.value)}
          />
        </div>
      </div>
      <button
        className="btn btn-primary"
        disabled={!isValid}
        onClick={() => commit(data)}
      >
        Let's go!
      </button>
    </>
  );
}
