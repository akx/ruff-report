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

const enum Fixability {
  NotFixable = 0,
  SometimesFixable = 1,
  AlwaysFixable = 2,
}

export interface RuleExplanation {
  name: string;
  code: string;
  explanation: string;
  preview?: boolean;
  fix?: Fixability;
}
