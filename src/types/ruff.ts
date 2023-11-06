export interface Message {
  cell: string | null;
  code: string;
  end_location: Location;
  filename: string;
  fix: Fix | null;
  location: Location;
  message: string;
  noqa_row: number;
  url: string;
}

export interface Location {
  column: number;
  row: number;
}

export interface Fix {
  applicability: string;
  edits: Edit[];
  message: string;
}

export interface Edit {
  content: string;
  end_location: Location;
  location: Location;
}

export interface RuleExplanation {
  name: string;
  code: string;
  linter: string;
  summary: string;
  message_formats: string[];
  fix: string;
  explanation: string;
  preview: boolean;
}
