export interface Message {
  code: string;
  message: string;
  fix: Fix | null;
  location: Location;
  end_location: Location;
  filename: string;
  noqa_row: number;
}

export interface Location {
  row: number;
  column: number;
}

export interface Fix {
  applicability: Applicability;
  message: string;
  edits: Edit[];
}

export enum Applicability {
  Automatic = "Automatic",
  Suggested = "Suggested",
  Unspecified = "Unspecified",
}

export interface Edit {
  content: string;
  location: Location;
  end_location: Location;
}

export interface RuleExplanation {
  name: string;
  code: string;
  linter: string;
  summary: string;
  message_formats: string[];
  autofix: string;
  explanation: string;
}
