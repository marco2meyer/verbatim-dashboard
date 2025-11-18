export interface Source {
  interview_id: string;
  chunk_numbers: number[];
}

export interface ValueOverview {
  value_id: string;
  label: string;
  interviewee_wording_examples: string[];
  importance_1_to_10: number;
  realization_1_to_10: number;
  comments: string;
}

export interface StoryDetail {
  short_name: string;
  quote_verbatim: string;
  compellingness_1_to_5: number;
  subtheme: string;
  question_for_context_verbatim: string;
  interviewee_first_name: string;
  interviewee_role: string;
  source: Source;
}

export interface EnablerOrBlockerDetail {
  short_name: string;
  quote_with_name_and_role: string;
  importance_1_to_5: number;
  source: Source;
}

export interface ValueDetails {
  label: string;
  stories: StoryDetail[];
  enablers: EnablerOrBlockerDetail[];
  blockers: EnablerOrBlockerDetail[];
}

export interface Chunk {
  chunk_number: number;
  speaker: 'interviewee' | 'interviewer';
  text: string;
}

export interface Interview {
  interview_id: string;
  interviewee_first_name: string;
  interviewee_role: string;
  chunks: Chunk[];
}

export interface RootData {
  values_overview: ValueOverview[];
  value_details: Record<string, ValueDetails>;
  interviews_raw: Interview[];
}

export interface TranscriptViewerProps {
  interviews: Interview[];
  open: boolean;
  onClose: () => void;
  focusedSource?: {
    interview_id: string;
    chunk_numbers: number[];
  };
}
