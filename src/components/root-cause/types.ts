export type RCAMethod = '5 Whys' | 'Fishbone (Ishikawa)' | 'Fault Tree Analysis' | 'Other';
export type RCAStatus = 'Draft' | 'In Progress' | 'Completed' | 'Closed';

export interface RCAAttachment {
  name: string;
  type: string;
  data: string;
}

export interface FiveWhysData {
  problemStatement: string;
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  rootCause: string;
}

export interface FishboneData {
  problemStatement: string;
  manpower: string;
  machine: string;
  material: string;
  method: string;
  measurement: string;
  environment: string;
  rootCause: string;
}

export interface OtherMethodData {
  problemStatement: string;
  methodName: string;
  analysisDetails: string;
  rootCause: string;
}

export interface RootCauseRecord {
  id: string;
  title: string;
  dateInitiated: string;
  leadInvestigator: string;
  relatedIssueId: string;
  status: RCAStatus;
  method: RCAMethod;
  analysisData: FiveWhysData | FishboneData | OtherMethodData;
  correctiveActionsProposed: string;
  attachments?: RCAAttachment[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
